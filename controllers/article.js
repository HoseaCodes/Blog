const Articles = require("../models/article");
const Logger = require('../logger');
const logger = new Logger('articles')


const articleCrtl = {
    getArticle,
    createArticle,
    deleteArticle,
    updateArticle
}

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

        const article = await Articles.findOne({ article_id });

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
        
        let originalBody = req.body
        
        await Articles.findOneAndUpdate({ _id: req.params.id }, {
            title: title.toLowerCase(), subtitle, description, content, images, category
        })
        
        let preparedLog = `Changing the following: ${originalBody} to ${req.body} for the article ${title}`;
        
        logger.info(preparedLog);
        
        res.json({ msg: 'Updated a article' })
    } catch (err) {
        
        logger.error(err)
        
        return res.status(500).json({ msg: err.message })
    }
}

module.exports = articleCrtl