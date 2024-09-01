const db = require("../db/connection.js");
const format = require("pg-format");

exports.checkExists = (table_name, column_name, value) => {
    const queryString = format(`SELECT * FROM %I WHERE %I = $1`, table_name, column_name);
    return db.query(queryString, [value]).then(({ rows }) => {
        if (rows.length === 0) {
            const article = table_name.slice(0, 1).toUpperCase() + table_name.slice(1, -1);
            return Promise.reject({ status: 404, msg: `${article} not found` });
        }
        return rows;
    });
};
