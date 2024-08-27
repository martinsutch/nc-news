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
});

describe("/api/articles", () => {
    describe("GET", () => {
        test("200: Responds with an array of article objects, each of which has appropriate properties (excluding comment_count which is next test)", () => {
            return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({ body: { articles } }) => {
                    expect(Array.isArray(articles)).toBe(true);
                    expect(articles).toHaveLength(13);
                    articles.forEach((article) => {
                        expect(article).toHaveProperty("article_id", expect.any(Number));
                        expect(article).toHaveProperty("title", expect.any(String));
                        expect(article).toHaveProperty("topic", expect.any(String));
                        expect(article).toHaveProperty("author", expect.any(String));
                        expect(article).toHaveProperty("created_at", expect.any(String));
                        expect(article).toHaveProperty("votes", expect.any(Number));
                        expect(article).toHaveProperty("article_img_url", expect.any(String));
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
        test("200: Articles are sorted by date in descending order", () => {
            return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({ body: { articles } }) => {
                    expect(articles).toBeSortedBy("created_at", { descending: true });
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
                        expect(comment).toHaveProperty("comment_id", expect.any(Number));
                        expect(comment).toHaveProperty("votes", expect.any(Number));
                        expect(comment).toHaveProperty("created_at", expect.any(String));
                        expect(comment).toHaveProperty("author", expect.any(String));
                        expect(comment).toHaveProperty("body", expect.any(String));
                        expect(comment).toHaveProperty("article_id", expect.any(Number));
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
});
