const apiRouter = require("express").Router();
const { getEndpoints } = require("../controllers/api-controller.js");
const usersRouter = require("./users-router");
const topicsRouter = require("./topics-router.js");
const commentsRouter = require("./comments-router.js");
const articlesRouter = require("./articles-router.js");

apiRouter.use("/users", usersRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.get("/", getEndpoints);

module.exports = apiRouter;