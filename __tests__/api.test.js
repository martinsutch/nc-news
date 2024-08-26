const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("/api/topics", () => {
    describe("GET", () => {
        test("200: status code of 200 is sent", () => {
            return request(app).get("/api/topics").expect(200);
        });
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
        test("200: status code of 200 is sent", () => {
            return request(app).get("/api").expect(200);
        });
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
        test("200: status code of 200 is sent", () => {
            return request(app).get("/api/articles/1").expect(200);
        });
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

/*

an article object, which should have the following properties:
author
title
article_id
body
topic
created_at
votes
article_img_url



*/
