const db = require("../db/connection.js");

exports.allTopics = () => {
    return db.query("SELECT * FROM topics").then(({ rows }) => {
        return rows;
    });
};

exports.topicBySlug = (slug) => {
    return db.query("SELECT * FROM topics WHERE slug = $1", [slug]).then(({ rows }) => {
        if (rows.length === 0) return Promise.reject({ status: 404, msg: "Topic not found" });
    });
};