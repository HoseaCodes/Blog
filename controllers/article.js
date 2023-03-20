import Articles from '../models/article.js';
import Logger from '../utils/logger.js';

const logger = new Logger('articles')

async function getArticle(req, res) {
    try {
        const articles = await Articles.find()

        logger.info("Returning the list of articles");

        res.json({
            status: 'success',
            articles: articles,
            result: articles.length,
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

        const article = await Articles.find({ article_id });

        if (article) {

            logger.error("Article already exist.");

            return res.status(400).json({ msg: "This article already exists." })
        }

        const newArticle = new Articles({
            article_id, title, subtitle, markdown, description, images, category
        })

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

        res.json({ msg: "Deleted a article" })
    } catch (err) {

        logger.error(err)

        return res.status(500).json({ msg: err.message })
    }
}

async function updateArticle(req, res) {
    try {
        const { title, subtitle, description, content, images, category } = req.body;

        if (!images) {

            logger.error("No image provided.");

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

export {   getArticle,
  createArticle,
  archiveArticle,
  deleteArticle,
  updateArticle };
