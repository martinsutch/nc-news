const db = require("../db/connection.js");
const format = require("pg-format");

exports.articleById = (article_id) => {
    return db
        .query(
            "SELECT article_id, title, topic, articles.body, articles.author, articles.created_at, articles.votes, article_img_url, COUNT(comments.body) AS comment_count FROM articles LEFT JOIN comments USING (article_id) WHERE article_id = $1 GROUP BY article_id",
            [article_id]
        )
        .then(({ rows }) => {
            if (rows.length === 0) return Promise.reject({ status: 404, msg: "Article not found" });
            return rows[0];
        });
};

exports.allArticles = (order, sort_by, topic) => {
    return db
        .query("SELECT column_name FROM information_schema.columns WHERE table_name = 'articles'")
        .then(({ rows }) => {
            const validColumns = rows.map((row) => row.column_name);
            if (!["ASC", "DESC"].includes(order.toUpperCase()) || !validColumns.includes(sort_by)) {
                return Promise.reject({ status: 400, msg: "Bad request" });
            }
            let queryString =
                "SELECT article_id, title, topic, articles.author, articles.created_at, articles.votes, article_img_url, COUNT(comments.body) AS comment_count FROM articles LEFT JOIN comments USING (article_id)";
            let queryValues = [];
            if (topic) {
                queryString += " WHERE topic = $1";
                queryValues.push(topic);
            }
            queryString += format(" GROUP BY article_id ORDER BY articles.%I %s", sort_by, order);
            return db.query(queryString, queryValues);
        })
        .then(({ rows }) => {
            return rows;
        });
};

exports.patchArticle = (article_id, inc_votes) => {
    return db
        .query("UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *", [inc_votes, article_id])
        .then(({ rows }) => {
            return rows[0];
        });
};
