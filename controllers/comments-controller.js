const { articleById } = require("../models/articles-model");
const { commentsByArticle, postComment } = require("../models/comments-model");
const { userByUsername } = require("../models/users-model");

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

exports.postCommentByArticle = (req, res, next) => {
    const {
        body: { username, body },
        params: { article_id },
    } = req;
    Promise.all([userByUsername(username), articleById(article_id)])
        .then(() => {
            return postComment(article_id, username, body);
        })
        .then((comment) => {
            res.status(201).send({ comment });
        })
        .catch((err) => {
            next(err);
        });
};
