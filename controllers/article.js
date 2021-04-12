const Articles = require("../models/article")



const articleCrtl = {
    getArticle,
    createArticle,
    deleteArticle,
    updateArticle
}

async function getArticle(req, res) {
    try {
        const articles = await Articles.find()

        res.json({
            status: 'success',
            articles: articles,
            result: articles.length,

        })
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
}

async function createArticle(req, res) {
    try {

        const { article_id, title, subtitle, markdown, description, content, images, category } = req.body;
        // if (!images) return res.status(400).json({ msg: "No image upload" })

        const article = await Articles.findOne({ article_id })
        console.log(article)
        if (article) return res.status(400).json({ msg: "This article already exists." })

        const newArticle = new Articles({
            article_id, title, subtitle, markdown, description, content, images, category
        })
        console.log(newArticle)
        await newArticle.save()

        res.json({ msg: "Created a new article" })
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
}

async function deleteArticle(req, res) {
    try {
        await Articles.findByIdAndDelete(req.params.id)
        res.json({ msg: "Deleted a article" })

    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
}

async function updateArticle(req, res) {
    try {
        const { title, subtitle, description, content, images, category } = req.body;
        if (!images) return res.status(400).json({ msg: "No image upload" })

        await Articles.findOneAndUpdate({ _id: req.params.id }, {
            title: title.toLowerCase(), subtitle, description, content, images, category
        })
        res.json({ msg: 'Updated a article' })
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
}

module.exports = articleCrtl