const articlesRouter = require("express").Router();
const { getArticles, getArticleById, patchArticleById } = require("../controllers/articles-controller");
const { getCommentsByArticle, postCommentByArticle } = require("../controllers/comments-controller");

articlesRouter
    .route("/")
    .get(getArticles);

articlesRouter
    .route("/:article_id")
    .get(getArticleById)
    .patch(patchArticleById);

articlesRouter
    .route("/:article_id/comments")
    .get(getCommentsByArticle)
    .post(postCommentByArticle);

module.exports = articlesRouter;
