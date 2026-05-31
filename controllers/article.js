import mongoose from "mongoose";
import Articles from "../models/article.js";
import Comments from "../models/comment.js";
import Users from "../models/user.js";
import Logger from "../utils/logger.js";
import { cache } from "../utils/cache.js";
import { getValidLinkedInToken, getLocalUserId } from "./linkedin.js";
import { broadcastArticle } from "./subscriber.js";
import axios from "axios";

const logger = new Logger("articles");

// Public visibility predicate. Mirrors routes/sitemap.js.
// Authenticated admin endpoints (getAdminArticles*) skip this filter.
const PUBLIC_FILTER = { draft: { $ne: true }, archived: { $ne: true } };

const SITE_URL = (process.env.SITE_URL || "https://hoseacodes.com").replace(/\/$/, "");

// Default text when the user didn't supply a custom linkedinIntro.
function defaultLinkedInText(article) {
  const parts = [];
  if (article.title) parts.push(article.title);
  if (article.description) parts.push(article.description);
  parts.push(`${SITE_URL}/blog/${article.slug}`);
  return parts.join("\n\n");
}

// Cross-post an already-saved article to LinkedIn. Never throws — failures
// are returned in the result so the article save itself stays successful.
// Pass { force: true } to bypass the linkedinPostedAt idempotency check, e.g.
// for the explicit "Post to LinkedIn now" button.
async function postArticleToLinkedIn(article, userId, { force = false } = {}) {
  if (!article || !userId) return { posted: false, skipped: "no-article-or-user" };
  if (!force && article.linkedinPostedAt) return { posted: false, skipped: "already-posted" };
  if (article.draft || article.archived) return { posted: false, skipped: "not-published" };

  try {
    const { accessToken, urn } = await getValidLinkedInToken(userId);
    const text =
      (article.linkedinIntro && article.linkedinIntro.trim()) ||
      defaultLinkedInText(article);

    const response = await axios.post(
      "https://api.linkedin.com/v2/ugcPosts",
      {
        author: urn,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: { text },
            shareMediaCategory: "NONE",
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Restli-Protocol-Version": "2.0.0",
          "Content-Type": "application/json",
        },
      }
    );

    const postUrn = response.headers["x-restli-id"] || response.data?.id || null;
    await Articles.findByIdAndUpdate(article._id, {
      linkedinPostedAt: new Date(),
      linkedinPostUrn: postUrn,
    });

    logger.info(`Posted to LinkedIn: ${postUrn} for article ${article._id}`);
    return { posted: true, postUrn };
  } catch (err) {
    const msg =
      err.response?.data?.message ||
      err.response?.data?.error_description ||
      err.message;
    logger.error(`LinkedIn cross-post failed: ${msg}`);
    return { posted: false, error: msg };
  }
}

async function getArticle(req, res) {
  try {
    const articles = await Articles.find(PUBLIC_FILTER).lean();

    // Live comment counts from the Comments collection. The denormalized
    // `article.comments` field is unreliable (nested-array corruption from
    // historical RightColumn writes), so derive counts fresh each fetch.
    const counts = await Comments.aggregate([
      { $group: { _id: "$blog", count: { $sum: 1 } } },
    ]);
    const countMap = new Map(counts.map((c) => [String(c._id), c.count]));
    for (const a of articles) {
      a.commentCount = countMap.get(String(a._id)) || 0;
    }

    logger.info("Returning the list of articles");

    res.cookie("articles-cache", articles.length + "articles", {
      maxAge: 1000 * 60 * 60, // would expire after an hour
      httpOnly: true, // The cookie only accessible by the web server
    });

    cache.set(articles.length + "articles", {
      status: "success",
      articles: articles,
      result: articles.length,
      location: "cache",
    });

    res.json({
      status: "success",
      articles: articles,
      result: articles.length,
      location: "main",
    });
  } catch (err) {
    logger.error(err);

    return res.status(500).json({ msg: err.message });
  }
}

async function getArticleByID(req, res) {
  try {
    const { id } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(id) && /^[a-f0-9]{24}$/i.test(id);

    let article = null;
    if (isObjectId) {
      article = await Articles.findOne({ _id: id, ...PUBLIC_FILTER }).lean();
    }
    if (!article) {
      article = await Articles.findOne({ slug: id, ...PUBLIC_FILTER }).lean();
    }

    if (!article)
      return res.status(404).send({ msg: "Article does not exist" });

    // See getArticle: the denormalized article.comments array is unreliable,
    // so derive the count fresh from the Comments collection.
    article.commentCount = await Comments.countDocuments({ blog: article._id });

    // If a token came along, populate the viewer's like/save state so the UI
    // can render the buttons in the correct toggled position on first paint.
    // No auth middleware on this route — we only attempt the lookup if a
    // local user id resolves; failures stay silent (article still returns).
    article.liked = false;
    article.saved = false;
    try {
      const userId = await getLocalUserId(req);
      if (userId) {
        const user = await Users.findById(userId).select("likedArticles savedArticles");
        if (user) {
          const articleIdStr = String(article._id);
          article.liked = user.likedArticles.map(String).includes(articleIdStr);
          article.saved = user.savedArticles.map(String).includes(articleIdStr);
        }
      }
    } catch (_) {
      // anonymous viewer — defaults stay false
    }

    res.json({
      status: "success",
      article: article,
    });
  } catch (err) {
    logger.error(err);

    return res.status(500).json({ msg: err.message });
  }
}

// Admin-only: returns full article list including drafts and archived.
// Auth-gated at the route layer.
async function getAdminArticles(req, res) {
  try {
    const articles = await Articles.find().lean();

    const counts = await Comments.aggregate([
      { $group: { _id: "$blog", count: { $sum: 1 } } },
    ]);
    const countMap = new Map(counts.map((c) => [String(c._id), c.count]));
    for (const a of articles) {
      a.commentCount = countMap.get(String(a._id)) || 0;
    }

    res.json({
      status: "success",
      articles: articles,
      result: articles.length,
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

// Admin-only: fetch any article by id or slug, drafts included.
async function getAdminArticleByID(req, res) {
  try {
    const { id } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(id) && /^[a-f0-9]{24}$/i.test(id);

    let article = null;
    if (isObjectId) {
      article = await Articles.findOne({ _id: id });
    }
    if (!article) {
      article = await Articles.findOne({ slug: id });
    }

    if (!article)
      return res.status(404).send({ msg: "Article does not exist" });

    res.json({ status: "success", article });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

async function createArticle(req, res) {
  try {
    const {
      article_id,
      title,
      subtitle,
      markdown,
      description,
      draft,
      scheduled,
      scheduledDateTime,
      images,
      categories,
      tags,
      metaTitle,
      metaDescription,
      canonicalUrl,
      dev,
      medium,
      postedBy,
      series,
      linkedin,
      linkedinContent,
      linkedinIntro,
      notifySubscribers,
    } = req.body;

    switch (req.body) {
      case !article_id:
        logger.error("No article id provided.");
        return res.status(400).json({ msg: "No article id provided." });
      case !title:
        logger.error("No title provided.");
        return res.status(400).json({ msg: "No title provided." });
      case !subtitle:
        logger.error("No subtitle provided.");
        return res.status(400).json({ msg: "No subtitle provided." });
      case !markdown:
        logger.error("No markdown provided.");
        return res.status(400).json({ msg: "No markdown provided." });
      case !description:
        logger.error("No description provided.");
        return res.status(400).json({ msg: "No description provided." });
      case !categories:
        logger.error("No categories provided.");
        return res.status(400).json({ msg: "No categories provided." });
      case !postedBy:
        logger.error("No postedBy provided.");
        return res.status(400).json({ msg: "No postedBy provided." });
      default:
        break;
    }

    if (!images) {
      logger.error("No image provided.");
      return res.status(400).json({ msg: "No image upload" });
    }

    const article = await Articles.find({ article_id });
    if (article.length > 0) {
      logger.error("Article already exist.");
      return res.status(400).json({ msg: "This article already exists." });
    }

    if (scheduled & scheduledDateTime) {
      if (new Date(scheduledDateTime) < new Date()) {
        logger.error("Scheduled date is in the past.");
        return res.status(400).json({ msg: "Scheduled date is in the past." });
      }
    }

    const newArticle = new Articles({
      article_id,
      title,
      subtitle,
      markdown,
      draft,
      scheduled,
      scheduledDateTime,
      description,
      images,
      postedBy,
      tags: Array.isArray(tags) ? tags : [],
      categories,
      slug: title.toLowerCase().replace(/ /g, "-"),
      metaTitle: metaTitle || "",
      metaDescription: metaDescription || "",
      canonicalUrl: canonicalUrl || "",
      dev,
      medium,
      linkedin,
      linkedinContent,
      linkedinIntro: linkedinIntro || null,
      notifySubscribers: !!notifySubscribers,
    });

    if (dev) {
      try {
        if (!title || !markdown || !series) {
          logger.error("No title, markdown or series provided.");
          return res
            .status(400)
            .json({ msg: "No title, markdown or series provided." });
        }
        if (!process.env.FOREMAPI) {
          logger.error("No dev api provided.");
          return res.status(400).json({ msg: "No dev api provided." });
        }
        await axios.post(
          "https://dev.to/api/articles",
          {
            article: {
              title: title,
              published: false,
              body_markdown: markdown,
              tags: ["api", "hoseacodes"],
              series: series,
            },
          },
          {
            headers: { "api-key": process.env.FOREMAPI },
          }
        );
        logger.info("Published to Dev To");
      } catch (error) {
        logger.error(error);
        return res.status(error.response.status).json({
          code: error.response.statusText,
          msg: error.response.data,
        });
      }
    }

    if (medium) {
      try {
        if (!series) {
          logger.error("No series provided.");
          return res.status(400).json({ msg: "No series upload" });
        }
        if (!process.env.MEDIUMUSER || !process.env.MEDIUMAPI) {
          logger.error("No medium user or api provided.");
          return res
            .status(400)
            .json({ msg: "No medium user or api provided." });
        }
        await axios.post(
          `https://api.medium.com/v1/users/${process.env.MEDIUMUSER}/posts`,
          {
            title: title,
            contentFormat: "markdown",
            content: markdown,
            canonicalUrl: images.secure_url,
            tags: ["api", "hoseacodes"],
            publishStatus: "public",
            notifyFollowers: true,
          },
          {
            headers: { Authorization: `Bearer ${process.env.MEDIUMAPI}` },
          }
        );
        logger.info("Published to Medium");
      } catch (error) {
        logger.error(error);
        return res.status(error.response.status).json({
          code: error.response.statusText,
          msg: error.response.data,
        });
      }
    }

    res.clearCookie("artilces-cache");
    const savedArticle = await newArticle.save();

    logger.info(`New article ${title} has been created`);

    // Cross-post to LinkedIn after the article exists so we can stamp it
    // with linkedinPostedAt and prevent duplicate posts on republish.
    // Use local Users._id (resolved from email), not Storm-Gate's id — see
    // controllers/linkedin.js getLocalUserId for why.
    let linkedinResult = null;
    if (linkedin && !savedArticle.draft && !savedArticle.archived) {
      const localId = await getLocalUserId(req);
      linkedinResult = await postArticleToLinkedIn(savedArticle, localId);
    }

    // Newsletter broadcast: fire-and-forget so the response isn't blocked by
    // N sequential Resend sends. broadcastArticle stamps newsletterSentAt, so
    // republishing the same article won't re-broadcast on its own (admin can
    // force via POST /api/subscribers/broadcast/:id if needed).
    if (
      savedArticle.notifySubscribers &&
      !savedArticle.draft &&
      !savedArticle.archived &&
      !savedArticle.newsletterSentAt
    ) {
      broadcastArticle(savedArticle).catch((err) =>
        logger.error(`Newsletter broadcast failed for ${savedArticle._id}: ${err.message}`)
      );
    }

    res.json({
      success: true,
      msg: "Created a new article",
      article: {
        article_id: savedArticle.article_id || savedArticle._id,
        title: savedArticle.title,
        slug: savedArticle.slug,
      },
      linkedin: linkedinResult,
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

async function deleteArticle(req, res) {
  try {
    logger.info(`Deleted article ${req.params.id} has been deleted`);

    await Articles.findByIdAndDelete(req.params.id);
    res.clearCookie("articles-cache");
    res.json({ msg: "Deleted a article" });
  } catch (err) {
    logger.error(err);

    return res.status(500).json({ msg: err.message });
  }
}

// Toggle a like on the article for the authenticated user. Per-user dedup
// lives on the User document (likedArticles array of article ids). The
// Articles.likes count is maintained as a denormalized total via $inc to
// avoid scanning the User collection on every read. Idempotent in spirit —
// clicking twice unlikes — but not atomic across the two writes; for a
// solo blog with low contention that's an acceptable trade.
async function toggleLike(req, res) {
  try {
    const articleId = req.params.id;
    const userId = await getLocalUserId(req);
    if (!userId) return res.status(401).json({ msg: "Login required to like." });

    const user = await Users.findById(userId).select("likedArticles");
    if (!user) return res.status(404).json({ msg: "User not found." });

    const alreadyLiked = user.likedArticles.map(String).includes(String(articleId));

    if (alreadyLiked) {
      await Users.findByIdAndUpdate(userId, { $pull: { likedArticles: articleId } });
      const updated = await Articles.findByIdAndUpdate(
        articleId,
        { $inc: { likes: -1 } },
        { new: true }
      ).select("likes");
      return res.json({ liked: false, totalLikes: Math.max(0, updated?.likes || 0) });
    }

    await Users.findByIdAndUpdate(userId, { $addToSet: { likedArticles: articleId } });
    const updated = await Articles.findByIdAndUpdate(
      articleId,
      { $inc: { likes: 1 } },
      { new: true }
    ).select("likes");
    return res.json({ liked: true, totalLikes: updated?.likes || 0 });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

// Toggle a bookmark/save on the article for the authenticated user.
// Source of truth is User.savedArticles. No counterpart on Articles since
// total-saves isn't a public surface.
async function toggleSave(req, res) {
  try {
    const articleId = req.params.id;
    const userId = await getLocalUserId(req);
    if (!userId) return res.status(401).json({ msg: "Login required to save." });

    const user = await Users.findById(userId).select("savedArticles");
    if (!user) return res.status(404).json({ msg: "User not found." });

    const alreadySaved = user.savedArticles.map(String).includes(String(articleId));

    if (alreadySaved) {
      await Users.findByIdAndUpdate(userId, { $pull: { savedArticles: articleId } });
      return res.json({ saved: false });
    }

    await Users.findByIdAndUpdate(userId, { $addToSet: { savedArticles: articleId } });
    return res.json({ saved: true });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

// GET /api/articles/saved — returns full article docs the authenticated user
// has bookmarked, newest-saved first (preserves insertion order via the array).
async function getSavedArticles(req, res) {
  try {
    const userId = await getLocalUserId(req);
    if (!userId) return res.status(401).json({ msg: "Login required." });

    const user = await Users.findById(userId).select("savedArticles");
    if (!user) return res.status(404).json({ msg: "User not found." });

    const ids = (user.savedArticles || []).map((id) => {
      try { return new mongoose.Types.ObjectId(String(id)); } catch { return null; }
    }).filter(Boolean);

    const articles = await Articles.find({
      _id: { $in: ids },
      ...PUBLIC_FILTER,
    }).lean();

    // Preserve user's save order (newest first) — Mongo $in returns whatever
    // order it likes.
    const order = new Map(ids.map((id, i) => [String(id), i]));
    articles.sort((a, b) => (order.get(String(a._id)) ?? 0) - (order.get(String(b._id)) ?? 0));

    return res.json({ status: "success", articles, count: articles.length });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

async function updateArticleComment(req, res) {
  try {
    const { article_id, post_id, comment, markdown, user_id, date_created } =
      req.body;

    const originalBody = req.body;

    await Comments.findOneAndUpdate(
      { _id: req.params.id },
      {
        article_id,
        post_id,
        comment,
        user_id,
        markdown,
        date_created,
      }
    );

    const preparedLog = `Changing the following: ${originalBody} to ${req.body} for the comment ${title}`;
    res.clearCookie("comments-cache");
    logger.info(preparedLog);

    res.json({ msg: "Updated a comment" });
  } catch (err) {
    logger.error(err);

    return res.status(500).json({ msg: err.message });
  }
}

async function updateArticle(req, res) {
  try {
    const originalBody = req.body;
    const { title, comments, ...rest } = originalBody;

    logger.info("PUT /api/articles/" + req.params.id + " body tags=" + JSON.stringify(originalBody.tags) + " rest.tags=" + JSON.stringify(rest.tags));

    const originalArticle = await Articles.findOne({ _id: req.params.id });

    res.clearCookie("articles-cache");

    if (comments) {
      await Articles.findOneAndUpdate(
        { _id: req.params.id },
        {
          comments: [originalArticle.comments, ...comments],
        }
      );
    }

    await Articles.findOneAndUpdate({ _id: req.params.id }, rest);

    const afterUpdate = await Articles.findOne({ _id: req.params.id });
    logger.info("After update, tags in DB = " + JSON.stringify(afterUpdate?.tags));

    const preparedLog = `Changing the following: ${originalBody} to ${req.body} for the article ${title}`;

    logger.info(preparedLog);

    // Draft → publish transition: if the update set linkedin=true and the
    // article is now public, cross-post (idempotent via linkedinPostedAt).
    // Use local Users._id (resolved from email), not Storm-Gate's id.
    let linkedinResult = null;
    if (rest.linkedin && afterUpdate && !afterUpdate.draft && !afterUpdate.archived) {
      const localId = await getLocalUserId(req);
      linkedinResult = await postArticleToLinkedIn(afterUpdate, localId);
    }

    // Draft → publish transition: if notifySubscribers is on and we haven't
    // sent before, fire the newsletter broadcast. Fire-and-forget for the
    // same reason as createArticle.
    if (
      afterUpdate &&
      afterUpdate.notifySubscribers &&
      !afterUpdate.draft &&
      !afterUpdate.archived &&
      !afterUpdate.newsletterSentAt
    ) {
      broadcastArticle(afterUpdate).catch((err) =>
        logger.error(`Newsletter broadcast failed for ${afterUpdate._id}: ${err.message}`)
      );
    }

    res.json({ msg: "Updated a article", linkedin: linkedinResult });
  } catch (err) {
    logger.error(err);
    console.log(err.message);

    return res.status(500).json({ msg: err.message });
  }
}

async function conditionalArticle(req, res) {
  try {
    const { archive, draft } = req.body;
    if (archive) {
      await Articles.findOneAndUpdate(
        { _id: req.params.id },
        {
          archived: archive,
        }
      );
      logger.info("Updated archive");
      res.json({ msg: `Moved ${req.params.id} to archive` });
    } else if (draft) {
      await Articles.findOneAndUpdate(
        { _id: req.params.id },
        {
          draft: draft,
        }
      );
      logger.info("Updated draft");
      res.json({ msg: `Moved ${req.params.id} to archive` });
    }
  } catch (err) {
    logger.error(err);

    return res.status(500).json({ msg: err.message });
  }
}

export {
  getArticle,
  getArticleByID,
  getAdminArticles,
  getAdminArticleByID,
  createArticle,
  conditionalArticle,
  deleteArticle,
  updateArticle,
  updateArticleComment,
  toggleLike,
  toggleSave,
  getSavedArticles,
  postArticleToLinkedIn,
};
