const db = require("../db/connection.js");

exports.articleById = (article_id) => {
    return db.query("SELECT * FROM articles WHERE article_id = $1", [article_id]).then(({ rows }) => {
        if (rows.length === 0) return Promise.reject({ status: 404, msg: "Article not found" });
        return rows[0];
    });
};

exports.allArticles = () => {
    return db
        .query(
            "SELECT article_id, title, topic, articles.author, articles.created_at, articles.votes, article_img_url, COUNT(comments.body) AS comment_count FROM articles LEFT JOIN comments USING (article_id) GROUP BY article_id ORDER BY articles.created_at DESC"
        )
        .then(({ rows }) => {
            return rows;
        });
};
