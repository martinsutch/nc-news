const { commentsByArticle, postComment, deleteComment, patchComment } = require("../models/comments-model");
const { checkExists } = require("./utils");

exports.getCommentsByArticle = (req, res, next) => {
    const { article_id } = req.params;
    Promise.all([checkExists("articles", "article_id", article_id), commentsByArticle(article_id)])
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
    Promise.all([checkExists("users", "username", username), checkExists("articles", "article_id", article_id)])
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

exports.patchCommentById = (req, res, next) => {
    const {
        body: { inc_votes },
        params: { comment_id },
    } = req;
    checkExists("comments", "comment_id", comment_id)
        .then(() => {
            return patchComment(comment_id, inc_votes);
        })
        .then((comment) => {
            res.status(200).send({ comment });
        })
        .catch((err) => {
            next(err);
        });
};
