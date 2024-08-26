const db = require("../db/connection.js");

exports.allTopics = () => {
    return db.query("SELECT * FROM topics").then(({ rows }) => {
        return rows;
    });
};
