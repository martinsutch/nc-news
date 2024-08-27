const { articleById } = require("../models/articles-model");
const { commentsByArticle } = require("../models/comments-model");

exports.getCommentsByArticle = (req, res, next) => {
    const { article_id } = req.params;
    articleById(article_id)
        .then(() => {
            return commentsByArticle(article_id);
        })
        .then((comments) => {
            res.status(200).send({ comments });
        })
        .catch((err) => {
            next(err);
        });
};
