const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("/api/topics", () => {
    describe("GET", () => {
        test("200: Responds with an array of topic objects, each of which a slug and description property", () => {
            return request(app)
                .get("/api/topics")
                .expect(200)
                .then(({ body: { topics } }) => {
                    expect(Array.isArray(topics)).toBe(true);
                    expect(topics).toHaveLength(3);
                    topics.forEach((topic) => {
                        expect(topic).toHaveProperty("slug", expect.any(String));
                        expect(topic).toHaveProperty("description", expect.any(String));
                    });
                });
        });
        test("404: unknown endpoint sends an appropriate error message", () => {
            return request(app)
                .get("/api/unknown")
                .expect(404)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Page not found");
                });
        });
    });
});

describe("/api", () => {
    describe("GET", () => {
        test("200: Responds with the body of endpoints.json", () => {
            return request(app)
                .get("/api")
                .expect(200)
                .then(({ body: { endpoints } }) => {
                    expect(typeof endpoints).toBe("object");
                    expect(endpoints).toHaveProperty("GET /api");
                    expect(endpoints).toHaveProperty("GET /api/topics");
                    expect(endpoints).toHaveProperty("GET /api/articles");
                    Object.values(endpoints).forEach((endpoint) => {
                        expect(endpoint).toHaveProperty("description");
                    });
                });
        });
    });
});

describe("/api/articles/:article_id", () => {
    describe("GET", () => {
        test("200: responds with an article object, which has appropriate properties", () => {
            return request(app)
                .get("/api/articles/1")
                .expect(200)
                .then(({ body: { article } }) => {
                    expect(typeof article).toBe("object");
                    expect(article).toEqual(
                        expect.objectContaining({
                            article_id: 1,
                            title: "Living in the shadow of a great man",
                            topic: "mitch",
                            author: "butter_bridge",
                            body: "I find this existence challenging",
                            created_at: expect.any(String),
                            votes: 100,
                            article_img_url:
                                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                        })
                    );
                });
        });
        test("200: Article object includes a comment_count property which is the sum of comments associated with that article", () => {
            return request(app)
                .get("/api/articles/1")
                .expect(200)
                .then(({ body: { article } }) => {
                    expect(article).toHaveProperty("comment_count", "11");
                });
        });
        test("404: sends an appropriate status and error message when given a non-existant id", () => {
            return request(app)
                .get("/api/articles/9999")
                .expect(404)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Article not found");
                });
        });
        test("400: sends an appropriate status and error message when given an invalid id", () => {
            return request(app)
                .get("/api/articles/unknown")
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Bad request");
                });
        });
    });
    describe("PATCH", () => {
        test("200: Responds with the updated article", () => {
            return request(app)
                .patch("/api/articles/1")
                .send({ inc_votes: 10 })
                .expect(200)
                .then(({ body: { article } }) => {
                    expect(article).toEqual(
                        expect.objectContaining({
                            article_id: 1,
                            title: "Living in the shadow of a great man",
                            topic: "mitch",
                            author: "butter_bridge",
                            body: "I find this existence challenging",
                            created_at: expect.any(String),
                            votes: 110,
                            article_img_url:
                                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                        })
                    );
                });
        });
        test("200: Ignores extra data and continues with request", () => {
            return request(app)
                .patch("/api/articles/1")
                .send({ inc_votes: -10, title: "Great man living in the shadows" })
                .expect(200)
                .then(({ body: { article } }) => {
                    expect(article).toEqual(
                        expect.objectContaining({
                            article_id: 1,
                            title: "Living in the shadow of a great man",
                            topic: "mitch",
                            author: "butter_bridge",
                            body: "I find this existence challenging",
                            created_at: expect.any(String),
                            votes: 90,
                            article_img_url:
                                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                        })
                    );
                });
        });
        test("400: sends an appropriate status and error message when not provided sufficient data", () => {
            return request(app)
                .patch("/api/articles/1")
                .send({ username: "lurker" })
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Bad request");
                });
        });
        test("400: sends an appropriate status and error message when provided wrong data type", () => {
            return request(app)
                .patch("/api/articles/1")
                .send({ inc_votes: "ten" })
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Bad request");
                });
        });
        test("404: sends an appropriate status and error message when given a non-existant id", () => {
            return request(app)
                .patch("/api/articles/9999")
                .send({ inc_votes: 10 })
                .expect(404)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Article not found");
                });
        });
    });
});

describe("/api/articles", () => {
    describe("GET", () => {
        describe("standard requests", () => {
            test("200: Responds with an array of article objects, each of which has appropriate properties (excluding comment_count which is next test)", () => {
                return request(app)
                    .get("/api/articles")
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        expect(Array.isArray(articles)).toBe(true);
                        expect(articles).toHaveLength(13);
                        articles.forEach((article) => {
                            expect(article).toEqual(
                                expect.objectContaining({
                                    article_id: expect.any(Number),
                                    title: expect.any(String),
                                    topic: expect.any(String),
                                    author: expect.any(String),
                                    created_at: expect.any(String),
                                    votes: expect.any(Number),
                                    article_img_url: expect.any(String),
                                })
                            );
                            expect(article).not.toHaveProperty("body");
                        });
                    });
            });
            test("200: Each article object includes a comment_count property which is the sum of comments associated with that article", () => {
                return request(app)
                    .get("/api/articles")
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        const article1 = articles.find((article) => article.article_id === 1);
                        const article2 = articles.find((article) => article.article_id === 2);
                        const article3 = articles.find((article) => article.article_id === 3);
                        expect(article1).toHaveProperty("comment_count", "11");
                        expect(article2).toHaveProperty("comment_count", "0");
                        expect(article3).toHaveProperty("comment_count", "2");
                    });
            });
            test("200: Articles are sorted by date in descending order by default", () => {
                return request(app)
                    .get("/api/articles")
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        expect(articles).toBeSortedBy("created_at", { descending: true });
                    });
            });
        });
        describe("sorting queries", () => {
            test("200: order=ASC query orders articles by date in ascending order", () => {
                return request(app)
                    .get("/api/articles?order=ASC")
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        expect(articles).toBeSortedBy("created_at", { descending: false });
                    });
            });
            test("200: order=asc query works regardless of value case", () => {
                return request(app)
                    .get("/api/articles?order=asc")
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        expect(articles).toBeSortedBy("created_at", { descending: false });
                    });
            });
            test("400: sends an appropriate status and error message when not provided asc or desc as order", () => {
                return request(app)
                    .get("/api/articles?order=up")
                    .expect(400)
                    .then(({ body: { msg } }) => {
                        expect(msg).toBe("Bad request");
                    });
            });
            test("200: Ignores unknown queries and continues with request", () => {
                return request(app)
                    .get("/api/articles?dancing=true")
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        expect(articles).toBeSortedBy("created_at", { descending: true });
                    });
            });
            test("200: sort_by=author query responds with articles sorted by author in descending order by default", () => {
                return request(app)
                    .get("/api/articles?sort_by=author")
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        expect(articles).toBeSortedBy("author", { descending: true });
                    });
            });
            test("200: sort_by=votes&order=asc queries responds with articles sorted by author in ascending order", () => {
                return request(app)
                    .get("/api/articles?sort_by=votes&order=asc")
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        expect(articles).toBeSortedBy("votes", { descending: false });
                    });
            });
            test("400: sends an appropriate status and error message when given an invalid sort_by value", () => {
                return request(app)
                    .get("/api/articles?sort_by=fabulousness")
                    .expect(400)
                    .then(({ body: { msg } }) => {
                        expect(msg).toBe("Bad request");
                    });
            });
        });
        describe("filtering queries", () => {
            test("200: topic query filters articles by topic given", () => {
                return request(app)
                    .get("/api/articles?topic=cats")
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        articles.forEach((article) => {
                            expect(article.topic).toBe("cats");
                        });
                    });
            });
            test("200: Three queries work together correctly", () => {
                return request(app)
                    .get("/api/articles?topic=mitch&sort_by=votes&order=asc")
                    .expect(200)
                    .then(({ body: { articles } }) => {
                        expect(articles).toBeSortedBy("votes", { descending: false });
                        articles.forEach((article) => {
                            expect(article.topic).toBe("mitch");
                        });
                    });
            });
            test("404: sends an appropriate status and error message when given a non-existant topic", () => {
                return request(app)
                    .get("/api/articles?topic=unicorns")
                    .expect(404)
                    .then(({ body: { msg } }) => {
                        expect(msg).toBe("Topic not found");
                    });
            });
        });
    });
    describe("POST", () => {
        test("201: Responds with the posted article", () => {
            return request(app)
                .post("/api/articles")
                .send({
                    author: "icellusedkars",
                    title: "Example Title",
                    body: "Example body of text",
                    topic: "paper",
                    article_img_url:
                        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                })
                .expect(201)
                .then(({ body: { article } }) => {
                    expect(article).toEqual(
                        expect.objectContaining({
                            article_id: expect.any(Number),
                            author: "icellusedkars",
                            title: "Example Title",
                            body: "Example body of text",
                            topic: "paper",
                            article_img_url:
                                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                            votes: 0,
                            created_at: expect.any(String),
                            comment_count: 0,
                        })
                    );
                });
        });
        test("201: Provides a default URL if not provided with one", () => {
            return request(app)
                .post("/api/articles")
                .send({
                    author: "icellusedkars",
                    title: "Example Title",
                    body: "Example body of text",
                    topic: "paper",
                })
                .expect(201)
                .then(({ body: { article } }) => {
                    expect(article).toEqual(
                        expect.objectContaining({
                            article_id: expect.any(Number),
                            author: "icellusedkars",
                            title: "Example Title",
                            body: "Example body of text",
                            topic: "paper",
                            article_img_url: expect.any(String),
                            votes: 0,
                            created_at: expect.any(String),
                            comment_count: 0,
                        })
                    );
                });
        });
        test("400: sends an appropriate status and error message when not provided sufficient data (no title)", () => {
            return request(app)
                .post("/api/articles")
                .send({
                    author: "icellusedkars",
                    body: "Example body of text",
                    topic: "paper",
                })
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Bad request");
                });
        });
        test("400: sends an appropriate status and error message when not provided sufficient data (no body)", () => {
            return request(app)
                .post("/api/articles")
                .send({
                    author: "icellusedkars",
                    title: "Example Title",
                    topic: "paper",
                })
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Bad request");
                });
        });
        test("400: sends an appropriate status and error message when given an invalid URL", () => {
            return request(app)
                .post("/api/articles")
                .send({
                    author: "icellusedkars",
                    title: "Example Title",
                    body: "Example body of text",
                    topic: "paper",
                    article_img_url: "i-am-not-a-url",
                })
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Bad request");
                });
        });
        test("404: sends an appropriate status and error message when given an non-existant username", () => {
            return request(app)
                .post("/api/articles")
                .send({
                    author: "jellybeans",
                    title: "Example Title",
                    body: "Example body of text",
                    topic: "paper",
                })
                .expect(404)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("User not found");
                });
        });
        test("404: sends an appropriate status and error message when given an non-existant topic", () => {
            return request(app)
                .post("/api/articles")
                .send({
                    author: "icellusedkars",
                    title: "Example Title",
                    body: "Example body of text",
                    topic: "giraffes",
                })
                .expect(404)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Topic not found");
                });
        });
    });
});

describe("/api/articles/:article_id/comments", () => {
    describe("GET", () => {
        test("200: Responds with an array of comment objects, each of which has appropriate properties", () => {
            return request(app)
                .get("/api/articles/1/comments")
                .expect(200)
                .then(({ body: { comments } }) => {
                    expect(Array.isArray(comments)).toBe(true);
                    expect(comments).toHaveLength(11);
                    comments.forEach((comment) => {
                        expect(comment).toEqual(
                            expect.objectContaining({
                                comment_id: expect.any(Number),
                                votes: expect.any(Number),
                                created_at: expect.any(String),
                                author: expect.any(String),
                                body: expect.any(String),
                                article_id: expect.any(Number),
                            })
                        );
                    });
                });
        });
        test("200: Comments are sorted by date in descending order", () => {
            return request(app)
                .get("/api/articles/1/comments")
                .expect(200)
                .then(({ body: { comments } }) => {
                    expect(comments).toBeSortedBy("created_at", { descending: true });
                });
        });
        test("200: Responds with an empty array if the article has no comments", () => {
            return request(app)
                .get("/api/articles/2/comments")
                .expect(200)
                .then(({ body: { comments } }) => {
                    expect(Array.isArray(comments)).toBe(true);
                    expect(comments).toHaveLength(0);
                });
        });
        test("404: sends an appropriate status and error message when given a non-existant id", () => {
            return request(app)
                .get("/api/articles/9999/comments")
                .expect(404)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Article not found");
                });
        });
    });
    describe("POST", () => {
        test("201: Responds with the posted comment", () => {
            return request(app)
                .post("/api/articles/2/comments")
                .send({ username: "lurker", body: "example body of text" })
                .expect(201)
                .then(({ body: { comment } }) => {
                    expect(comment).toEqual(
                        expect.objectContaining({
                            comment_id: expect.any(Number),
                            votes: 0,
                            created_at: expect.any(String),
                            author: "lurker",
                            body: "example body of text",
                            article_id: 2,
                        })
                    );
                });
        });
        test("400: sends an appropriate status and error message when not provided sufficient data", () => {
            return request(app)
                .post("/api/articles/2/comments")
                .send({ username: "lurker" })
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Bad request");
                });
        });
        test("404: sends an appropriate status and error message when given an non-existant username", () => {
            return request(app)
                .post("/api/articles/2/comments")
                .send({ username: "unknown", body: "example body of text" })
                .expect(404)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("User not found");
                });
        });
        test("404: sends an appropriate status and error message when given a non-existant id", () => {
            return request(app)
                .post("/api/articles/9999/comments")
                .send({ username: "lurker", body: "example body of text" })
                .expect(404)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Article not found");
                });
        });
    });
});

describe("/api/comments/:comment_id", () => {
    describe("DELETE", () => {
        test("Responds with status 204 and no content when comment is deleted", () => {
            return request(app)
                .delete("/api/comments/1")
                .expect(204)
                .then(({ body }) => {
                    expect(body).toEqual({});
                });
        });
        test("400: sends an appropriate status and error message when given an invalid id", () => {
            return request(app)
                .delete("/api/comments/unicorn")
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Bad request");
                });
        });
        test("404: sends an appropriate status and error message when given a non-existant id", () => {
            return request(app)
                .delete("/api/comments/9999")
                .expect(404)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Comment not found");
                });
        });
    });
    describe("PATCH", () => {
        test("200: Responds with the updated comment", () => {
            return request(app)
                .patch("/api/comments/1")
                .send({ inc_votes: 10 })
                .expect(200)
                .then(({ body: { comment } }) => {
                    expect(comment).toEqual(
                        expect.objectContaining({
                            comment_id: 1,
                            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                            votes: 26,
                            author: "butter_bridge",
                            article_id: 9,
                            created_at: expect.any(String),
                        })
                    );
                });
        });
        test("200: Ignores extra data and continues with request", () => {
            return request(app)
                .patch("/api/comments/1")
                .send({ inc_votes: -10, body: "Ew." })
                .expect(200)
                .then(({ body: { comment } }) => {
                    expect(comment).toEqual(
                        expect.objectContaining({
                            comment_id: 1,
                            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                            votes: 6,
                            author: "butter_bridge",
                            article_id: 9,
                            created_at: expect.any(String),
                        })
                    );
                });
        });
        test("400: sends an appropriate status and error message when not provided sufficient data", () => {
            return request(app)
                .patch("/api/comments/1")
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Bad request");
                });
        });
        test("400: sends an appropriate status and error message when provided wrong data type", () => {
            return request(app)
                .patch("/api/comments/1")
                .send({ inc_votes: "ten" })
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Bad request");
                });
        });
        test("404: sends an appropriate status and error message when given a non-existant id", () => {
            return request(app)
                .patch("/api/comments/9999")
                .send({ inc_votes: 10 })
                .expect(404)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Comment not found");
                });
        });
    });
});

describe("/api/users", () => {
    describe("GET", () => {
        test("200: Responds with an array of user objects, each of which has appropriate properties", () => {
            return request(app)
                .get("/api/users")
                .expect(200)
                .then(({ body: { users } }) => {
                    expect(Array.isArray(users)).toBe(true);
                    expect(users).toHaveLength(4);
                    users.forEach((user) => {
                        expect(user).toEqual(
                            expect.objectContaining({
                                username: expect.any(String),
                                name: expect.any(String),
                                avatar_url: expect.any(String),
                            })
                        );
                    });
                });
        });
    });
});

describe("/api/users/:username", () => {
    describe("GET", () => {
        test("200: responds with a user object, which has appropriate properties", () => {
            return request(app)
                .get("/api/users/rogersop")
                .expect(200)
                .then(({ body: { user } }) => {
                    expect(typeof user).toBe("object");
                    expect(user).toEqual(
                        expect.objectContaining({
                            username: "rogersop",
                            avatar_url: "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
                            name: "paul",
                        })
                    );
                });
        });
        test("404: sends an appropriate status and error message when given a non-existant id", () => {
            return request(app)
                .get("/api/users/i-do-not-exist")
                .expect(404)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("User not found");
                });
        });
    });
});
