const { articleById, allArticles, patchArticle, postArticle } = require("../models/articles-model");
const { checkExists } = require("./utils");

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;
    articleById(article_id)
        .then((article) => {
            res.status(200).send({ article });
        })
        .catch((err) => {
            next(err);
        });
};

exports.getArticles = (req, res, next) => {
    const { order = "DESC", sort_by = "created_at", topic } = req.query;
    const promiseArray = [allArticles(order, sort_by, topic)];
    if (topic) promiseArray.push(checkExists("topics", "slug", topic));
    Promise.all(promiseArray)
        .then(([articles]) => {
            res.status(200).send({ articles });
        })
        .catch((err) => {
            next(err);
        });
};

exports.patchArticleById = (req, res, next) => {
    const {
        body: { inc_votes },
        params: { article_id },
    } = req;
    checkExists("articles", "article_id", article_id)
        .then(() => {
            return patchArticle(article_id, inc_votes);
        })
        .then((article) => {
            res.status(200).send({ article });
        })
        .catch((err) => {
            next(err);
        });
};

exports.postInArticles = (req, res, next) => {
    let {
        body: { author, title, body, topic, article_img_url },
    } = req;
    const defaultImgArray = [
        "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1585241936939-be4099591252?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1516641396056-0ce60a85d49f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1709404700313-b95625f3fb79?q=80&w=3149&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1725656471105-c681d15d5834?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ];
    if (!article_img_url) {
        article_img_url = defaultImgArray[Math.floor(Math.random() * defaultImgArray.length)];
    } else {
        const regex =
            /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
        if (!regex.test(article_img_url)) return next({ status: 400, msg: "Bad request" });
    }
    Promise.all([checkExists("users", "username", author), checkExists("topics", "slug", topic)])
        .then(() => {
            return postArticle(author, title, body, topic, article_img_url);
        })
        .then((article) => {
            article.comment_count = 0;
            res.status(201).send({ article });
        })
        .catch((err) => {
            next(err);
        });
};
