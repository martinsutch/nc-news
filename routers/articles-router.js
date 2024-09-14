const articlesRouter = require("express").Router();
const { getArticles, getArticleById, patchArticleById, postInArticles } = require("../controllers/articles-controller");
const { getCommentsByArticle, postCommentByArticle } = require("../controllers/comments-controller");

articlesRouter
    .route("/")
    .get(getArticles)
    .post(postInArticles);

articlesRouter
    .route("/:article_id")
    .get(getArticleById)
    .patch(patchArticleById);

articlesRouter
    .route("/:article_id/comments")
    .get(getCommentsByArticle)
    .post(postCommentByArticle);

module.exports = articlesRouter;
