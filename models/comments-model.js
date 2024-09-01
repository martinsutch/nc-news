const db = require("../db/connection.js");

exports.commentsByArticle = (article_id) => {
    return db
        .query("SELECT * FROM comments WHERE article_id = $1 ORDER BY comments.created_at DESC", [article_id])
        .then(({ rows }) => {
            return rows;
        });
};

exports.postComment = (article_id, author, body) => {
    return db
        .query("INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *", [
            article_id,
            author,
            body,
        ])
        .then(({ rows }) => {
            return rows[0];
        });
};

exports.deleteComment = (comment_id) => {
    return db.query("DELETE FROM comments WHERE comment_id = $1 RETURNING *", [comment_id]).then(({ rows }) => {
        if (rows.length === 0) return Promise.reject({ status: 404, msg: "Comment not found" });
    });
};

exports.patchComment = (comment_id, inc_votes) => {
    return db
        .query("UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *", [inc_votes, comment_id])
        .then(({ rows }) => {
            return rows[0];
        });
};
