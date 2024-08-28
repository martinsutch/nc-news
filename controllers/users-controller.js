const { allUsers } = require("../models/users-model");

exports.getUsers = (req, res, next) => {
    allUsers().then((users) => {
        res.status(200).send({ users });
    });
};
