import Articles from '../models/article.js';
import Comments from '../models/article.js';
import Logger from '../utils/logger.js';
import {cache} from '../utils/cache.js';

const logger = new Logger('articles')

async function getArticle(req, res) {
    try {
        const articles = await Articles.find()

        logger.info("Returning the list of articles");

        res.cookie('articles-cache', articles.length + "articles", {
          maxAge: 1000 * 60 * 60, // would expire after an hour
          httpOnly: true, // The cookie only accessible by the web server
        })

        cache.set( articles.length + "articles", {
          status: 'success',
          articles: articles,
          result: articles.length,
          location: 'cache',
        });

        res.json({
            status: 'success',
            articles: articles,
            result: articles.length,
            location: 'main',

        })
    } catch (err) {

        logger.error(err);

        return res.status(500).json({ msg: err.message })
    }
}

async function createArticle(req, res) {
    try {

        const { article_id, title, subtitle, markdown, description, images, category } = req.body;

        if (!images) {

            logger.error("No image provided.");
            return res.status(400).json({ msg: "No image upload" });
          }

          const article = await Articles.findOne({ article_id });

          if (article) {

            logger.error("Article already exist.");

            return res.status(400).json({ msg: "This article already exists." })
          }

          const newArticle = new Articles({
            article_id, title, subtitle, markdown, description, images, category
          })

        res.clearCookie('artilces-cache');
        await newArticle.save()

        logger.info(`New article ${title} has been created`);

        res.json({ msg: "Created a new article" });
    } catch (err) {

        logger.error(err)

        return res.status(500).json({ msg: err.message })
    }
}

async function deleteArticle(req, res) {
    try {

        logger.info(`Deleted article ${req.params.id} has been deleted`);

        await Articles.findByIdAndDelete(req.params.id)
        res.clearCookie('articles-cache');
        res.json({ msg: "Deleted a article" })
    } catch (err) {

        logger.error(err)

        return res.status(500).json({ msg: err.message })
    }
}


async function deletePostcomment(req, res) {
  try {
    const post_id = req.body.post_id

      logger.info(`Deleted comment ${req.params.id} has been deleted`);

      await Articles.findByIdAndDelete(req.params.id)
      res.clearCookie('comments-cache');
      res.json({ msg: "Deleted a article" })
  } catch (err) {

      logger.error(err)

      return res.status(500).json({ msg: err.message })
  }
}

async function updateLikes(req, res) {
  try {

  const uid = req.body.uid
  const post_id = req.params.id
  const { likes } = req.body;

  const values = [ uid, post_id ]
  console.log(values)
  likes += 1;
  await Articles.findOneAndUpdate({ _id: req.params.id },
    {likes});

  } catch (err) {

    logger.error(err);

    return res.status(500).json({ msg: err.message });
  }
}

async function updateArticleComment(req, res) {
    try {
      const { article_id, post_id, comment, markdown, user_id, date_created } = req.body;

        const originalBody = req.body

        await Comments.findOneAndUpdate({ _id: req.params.id }, {
          article_id, post_id, comment, user_id, markdown, date_created
        })

        const preparedLog = `Changing the following: ${originalBody} to ${req.body} for the comment ${title}`;
        res.clearCookie('comments-cache');
        logger.info(preparedLog);

        res.json({ msg: 'Updated a comment' })
    } catch (err) {

        logger.error(err);

        return res.status(500).json({ msg: err.message });
    }
}

async function updateArticle(req, res) {
  try {
      const { title, subtitle, description, content, images, category } = req.body;
      res.clearCookie('articles-cache');

      if (!images) {

          logger.error("No image provided.");
          res.clearCookie('user-cache');
          return res.status(400).json({ msg: "No image upload" })
      }

      const originalBody = req.body

      await Articles.findOneAndUpdate({ _id: req.params.id }, {
          title: title.toLowerCase(), subtitle, description, content, images, category
      })

      const preparedLog = `Changing the following: ${originalBody} to ${req.body} for the article ${title}`;

      logger.info(preparedLog);

      res.json({ msg: 'Updated a article' })
  } catch (err) {

      logger.error(err);

      return res.status(500).json({ msg: err.message });
  }
}

async function archiveArticle(req, res) {
  try {
    const { archive } = req.body;
    console.log(archive)

    const originalBody = req.body

    await Articles.findOneAndUpdate({ _id: req.params.id }, {
      archived: archive
    })

    const preparedLog = `Changing the following: ${originalBody} to ${req.body} for the article ${archive}`;

    logger.info(preparedLog);

    res.json({ msg: `Moved ${req.params.id} to archive`})
  } catch (err) {

    logger.error(err);

    return res.status(500).json({msg: err.message});
  }
}

async function createArticleComment(req, res) {
  try {

    const { article_id, post_id, comment, markdown, user_id, date_created } = req.body;

    const article = await Articles.findOne({ article_id });

      const newComment = new Comments({
        article_id, post_id, comment, user_id, markdown, date_created
      })

      await newComment.save()

      logger.info(`New comment has been created`);
      res.clearCookie('comments-cache');

      res.json({ msg: "Created a new comment" });
  } catch (err) {

      logger.error(err)

      return res.status(500).json({ msg: err.message })
  }
}



export {
  getArticle,
  createArticle,
  createArticleComment,
  archiveArticle,
  deleteArticle,
  deletePostcomment,
  updateArticle,
  updateArticleComment,
  updateLikes,
 };
