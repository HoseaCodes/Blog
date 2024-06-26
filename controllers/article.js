import Articles from "../models/article.js";
import Comments from "../models/comment.js";
import Logger from "../utils/logger.js";
import { cache } from "../utils/cache.js";
import axios from "axios";

const logger = new Logger("articles");

async function getArticle(req, res) {
  try {
    const articles = await Articles.find();

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
    const article = await Articles.findOne({ _id: req.params.id });

    logger.info("Returning the list of articles");

    if (!article)
      return res.status(400).send({ msg: "Article does not exisit" });

    res.json({
      status: "success",
      article: article,
    });
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
      images,
      categories,
      dev,
      medium,
      postedBy,
      series,
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

    const newArticle = new Articles({
      article_id,
      title,
      subtitle,
      markdown,
      description,
      images,
      postedBy,
      tags: ["api", "hoseacodes"],
      categories,
      slug: title.toLowerCase().replace(/ /g, "-"),
    });

    try {
      if (dev) {
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
      }

      if (medium) {
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
      }
    } catch (error) {
      logger.error(error);
      return res.status(error.response.status).json({
        code: error.response.statusText,
        msg: error.response.data,
      });
    }

    res.clearCookie("artilces-cache");
    await newArticle.save();

    logger.info(`New article ${title} has been created`);

    res.json({ msg: "Created a new article" });
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

async function updateLikes(req, res) {
  try {
    const post_id = req.params.id;
    let { likes } = req.body;
    likes += 1;

    await Articles.findOneAndUpdate({ _id: post_id }, { likes });

    res.json({
      msg: `${post_id} received a new like`,
      totalLikes: likes,
    });
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
    const {
      title,
      subtitle,
      description,
      content,
      images,
      category,
      comments,
      draft,
      archive,
    } = req.body;

    const originalArticle = await Articles.findOne({ _id: req.params.id });

    res.clearCookie("articles-cache");

    const originalBody = req.body;

    if (comments) {
      await Articles.findOneAndUpdate(
        { _id: req.params.id },
        {
          // title: title.toLowerCase(),
          // subtitle,
          // description,
          // content,
          // images,
          // category,
          comments: [originalArticle.comments, ...comments],
        }
      );
    }

    if (draft) {
      console.log(`draft`);
      console.log(draft);
      await Articles.findOneAndUpdate(
        { _id: req.params.id },
        {
          draft: draft,
        }
      );
    }

    if (archive) {
      console.log(`archive`);
      console.log(archive);
      await Articles.findOneAndUpdate(
        { _id: req.params.id },
        {
          archived: archive,
        }
      );
    }

    const preparedLog = `Changing the following: ${originalBody} to ${req.body} for the article ${title}`;

    logger.info(preparedLog);

    res.json({ msg: "Updated a article" });
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
  createArticle,
  conditionalArticle,
  deleteArticle,
  updateArticle,
  updateArticleComment,
  updateLikes,
};
