const { allTopics } = require("../models/topics-model.js");

exports.getTopics = (req, res, next) => {
    allTopics().then((topics) => {
        res.status(200).send({ topics });
    });
};
