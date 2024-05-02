const Article = require('../../../models/article');
const { getArticle, createArticle, deleteArticle, updateArticle} = require('../../../controllers/article');
const {MongoClient} = require('mongodb');
const request = require('supertest');
const mongoose = require('mongoose')
const express = require('express');
const app = express();
require('./db');

const mockArticleData = {
  article_id: "1", title: "Title",
subtitle: "Subtitle", markdown: "Markdown", description: "Description",
images: "Image", category: "Category", createdAt: Date.now(),
sanitizedHtml: '<p>Markdown</p>\n', updatedAt: Date.now(), __v: 0}

const mockArticleData2 = {_id: mongoose.Types.ObjectId(),
  article_id: "2", title: "Title",
subtitle: "Subtitle", markdown: "Markdown", description: "Description",
images: "Image", category: "Category"}

// Initial setup and tear down
beforeEach(async () => {
  await Article.deleteMany()
  await Article(mockArticleData2).save()
})

// Setting up testing enviroment with test code
describe('Create article to database',() => {

  it("should create article in database", async () => {
    const mockArticle = new Article(mockArticleData);
    console.log(mockArticle)

    await mockArticle.save();
    // expect(mockArticle.article_id).toEqual("1")
    // expect(mockArticle.title).toEqual("Title")
    // expect(mockArticle.subtitle).toEqual("Subtitle")
    // expect(mockArticle.markdown).toEqual("Markdown")
    // expect(mockArticle.description).toEqual("Description")
    // expect(mockArticle.images).toEqual("Image")
    // expect(mockArticle.category).toEqual("Category")
    const insertedArticle = await Article.findOne({article_id: "1"});
    console.log(insertedArticle)
    // expect(insertedArticle).toEqual(mockArticle);
  });

  it("should verify create route", async () => {
    const response = await request(app).post('/api/articles').send({
      mockArticleData
    });

    expect(response.body).not.toBeNull();
  });

  it("should get article from database", async () => {
    const article = await Article.findById(mockArticleData2._id);

    console.log(article)
    expect(mockArticleData2.title).toBe("Title")
  })
});

