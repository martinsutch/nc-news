const { articleById, allArticles } = require("../models/articles-model");

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
    allArticles().then((articles) => {
        res.status(200).send({ articles });
    });
};
