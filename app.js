const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics-controller.js");
const {
    routeErrorHandler,
    serverErrorHandler,
    customErrorHandler,
    invalidInputErrorHandler,
} = require("./error-handlers.js");
const { getEndpoints } = require("./controllers/api-controller.js");
const { getArticleById } = require("./controllers/articles-controller.js");

app.get("/api", getEndpoints);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);

app.all("/*", routeErrorHandler);
app.use(invalidInputErrorHandler);
app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
