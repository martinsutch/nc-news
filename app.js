const express = require("express");
const app = express();
app.use(express.json());

const { getTopics } = require("./controllers/topics-controller.js");
const {
    routeErrorHandler,
    serverErrorHandler,
    customErrorHandler,
    invalidInputErrorHandler,
} = require("./error-handlers.js");
const { getEndpoints } = require("./controllers/api-controller.js");
const { getArticleById, getArticles, patchArticleById } = require("./controllers/articles-controller.js");
const {
    getCommentsByArticle,
    postCommentByArticle,
    deleteCommentById,
} = require("./controllers/comments-controller.js");
const { getUsers } = require("./controllers/users-controller.js");

app.get("/api", getEndpoints);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticle);
app.get("/api/users", getUsers);

app.post("/api/articles/:article_id/comments", postCommentByArticle);

app.patch("/api/articles/:article_id", patchArticleById);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.all("/*", routeErrorHandler);
app.use(invalidInputErrorHandler);
app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
