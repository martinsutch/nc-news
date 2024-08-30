const { allUsers, userByUsername } = require("../models/users-model");

exports.getUsers = (req, res, next) => {
    allUsers().then((users) => {
        res.status(200).send({ users });
    });
};

exports.getUserByUsername = (req, res, next) => {
    const { username } = req.params;
    userByUsername(username)
        .then((user) => {
            res.status(200).send({ user });
        })
        .catch((err) => {
            next(err);
        });
};
