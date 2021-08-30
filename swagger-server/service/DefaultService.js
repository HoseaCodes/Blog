'use strict';


/**
 * Removes an article by ID
 *
 * articleId Integer The ID of the article to return
 * returns inline_response_200
 **/
exports.articlesArticleIdDELETE = function(articleId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "article_id" : "article_id",
  "createdAt" : 0.8008281904610115,
  "images" : { },
  "sanitizedHtml" : "sanitizedHtml",
  "subtitle" : "subtitle",
  "markdown" : "markdown",
  "description" : "description",
  "checked" : true,
  "title" : "title",
  "category" : [ "category", "category" ]
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Returns a article by ID
 *
 * articleId Integer The ID of the article to return
 * returns inline_response_200
 **/
exports.articlesArticleIdGET = function(articleId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "article_id" : "article_id",
  "createdAt" : 0.8008281904610115,
  "images" : { },
  "sanitizedHtml" : "sanitizedHtml",
  "subtitle" : "subtitle",
  "markdown" : "markdown",
  "description" : "description",
  "checked" : true,
  "title" : "title",
  "category" : [ "category", "category" ]
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Update an article by ID
 *
 * articleId Integer The ID of the article to return
 * returns inline_response_200
 **/
exports.articlesArticleIdPUT = function(articleId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "article_id" : "article_id",
  "createdAt" : 0.8008281904610115,
  "images" : { },
  "sanitizedHtml" : "sanitizedHtml",
  "subtitle" : "subtitle",
  "markdown" : "markdown",
  "description" : "description",
  "checked" : true,
  "title" : "title",
  "category" : [ "category", "category" ]
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Returns all articles
 *
 * returns inline_response_200
 **/
exports.articlesGET = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "article_id" : "article_id",
  "createdAt" : 0.8008281904610115,
  "images" : { },
  "sanitizedHtml" : "sanitizedHtml",
  "subtitle" : "subtitle",
  "markdown" : "markdown",
  "description" : "description",
  "checked" : true,
  "title" : "title",
  "category" : [ "category", "category" ]
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

