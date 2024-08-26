const fs = require("fs/promises");

exports.allEndpoints = () => {
    return fs.readFile("endpoints.json").then((endpoints) => {
        return JSON.parse(endpoints);
    });
};
