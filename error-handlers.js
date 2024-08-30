exports.routeErrorHandler = (req, res) => {
    res.status(404).send({ msg: "Page not found" });
};

exports.invalidInputErrorHandler = (err, req, res, next) => {
    if (err.code === "22P02" || err.code === "23502" || err.code === "42703" || err.code === "42601") {
        res.status(400).send({ msg: "Bad request" });
    } else {
        next(err);
    }
};

exports.customErrorHandler = (err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else {
        next(err);
    }
};

exports.serverErrorHandler = (err, req, res, next) => {
    console.log(err, "500");
    res.status(500).send({ msg: "Internal server error" });
};
