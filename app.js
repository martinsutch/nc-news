const express = require("express");
const app = express();
app.use(express.json());
const {
    routeErrorHandler,
    serverErrorHandler,
    customErrorHandler,
    invalidInputErrorHandler,
} = require("./error-handlers.js");
const apiRouter = require("./routers/api-router.js");
const { getCommentsByArticle } = require("./controllers/comments-controller.js");

//app.get("/api/articles/:article_id/comments", getCommentsByArticle);

app.use("/api", apiRouter);

app.all("/*", routeErrorHandler);
app.use(invalidInputErrorHandler);
app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
