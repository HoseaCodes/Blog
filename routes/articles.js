const router = require('express').Router();
const articleCrtl = require('../controllers/article');

router.route('/articles')
    .get(articleCrtl.getArticle)
    .post(articleCrtl.createArticle)

router.route('/articles/:id')
    .patch(articleCrtl.archiveArticle)
    .delete(articleCrtl.deleteArticle)
    .put(articleCrtl.updateArticle)

module.exports = router
