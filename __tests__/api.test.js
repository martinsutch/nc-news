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
