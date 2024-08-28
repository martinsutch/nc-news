const { articleById, allArticles, patchArticle } = require("../models/articles-model");

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    articleById(article_id)
        .then((article) => {
            res.status(200).send({ article });
        })
        .catch((err) => {
            next(err);
        });
};

exports.getArticles = (req, res, next) => {
    const { order = "DESC", sort_by = "created_at" } = req.query;
    allArticles(order, sort_by)
        .then((articles) => {
            res.status(200).send({ articles });
        })
        .catch((err) => {
            next(err);
        });
};

exports.patchArticleById = (req, res, next) => {
    const {
        body: { inc_votes },
        params: { article_id },
    } = req;
    articleById(article_id)
        .then(() => {
            return patchArticle(article_id, inc_votes);
        })
        .then((article) => {
            res.status(200).send({ article });
        })
        .catch((err) => {
            next(err);
        });
};
