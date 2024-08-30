const { articleById, checkArticleById } = require("../models/articles-model");
const { commentsByArticle, postComment, deleteComment } = require("../models/comments-model");
const { userByUsername } = require("../models/users-model");

exports.getCommentsByArticle = (req, res, next) => {
    const { article_id } = req.params;
    //check exists
    Promise.all([checkArticleById(article_id), commentsByArticle(article_id)])
        .then(([_, comments]) => {
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

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params;
    deleteComment(comment_id)
        .then(() => {
            res.status(204).send();
        })
        .catch((err) => {
            next(err);
        });
};
