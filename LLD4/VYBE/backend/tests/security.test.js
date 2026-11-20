const request = require("supertest");
const app = require("../app");

describe("Secure headers", () => {
    test("the response no longer says it comes from Express", async () => {
        const res = await request(app).get("/api/movies");

        expect(res.headers["x-powered-by"]).toBeUndefined();
        expect(res.headers["x-content-type-options"]).toBe("nosniff");
    });
});

describe("Injection", () => {
    test("an object instead of an email is refused with 400", async () => {
        const res = await request(app)
            .post("/api/auth/forget-password")
            .send({ email: { $regex: "^a" } });

        expect(res.status).toBe(404);
        expect(res.body.message).toBe("email must be text");
    });
});