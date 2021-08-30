'use strict';

var utils = require('../utils/writer.js');
var Default = require('../service/DefaultService');

module.exports.articlesArticleIdDELETE = function articlesArticleIdDELETE (req, res, next, articleId) {
  Default.articlesArticleIdDELETE(articleId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.articlesArticleIdGET = function articlesArticleIdGET (req, res, next, articleId) {
  Default.articlesArticleIdGET(articleId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.articlesArticleIdPUT = function articlesArticleIdPUT (req, res, next, articleId) {
  Default.articlesArticleIdPUT(articleId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.articlesGET = function articlesGET (req, res, next) {
  Default.articlesGET()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
