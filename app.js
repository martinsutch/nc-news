const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics-controller.js");
const { routeErrorHandler, serverErrorHandler, customErrorHandler } = require("./error-handlers.js");

app.get("/api/topics", getTopics);

app.all("/*", routeErrorHandler);
app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
