exports.routeErrorHandler = (req, res) => {
    res.status(404).send({ msg: "Page not found" });
};

exports.customErrorHandler = (err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else {
        next(err);
    }
};

exports.serverErrorHandler = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: "Internal server error" });
};
