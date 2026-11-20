const request = require("supertest");
const app = require("../app");

describe("Login rate limit", () => {
  test("the 6th failed login is blocked, but another visitor is not", async () => {
    const tryLoginFrom = (ip) =>
      request(app)
        .post("/api/auth/login")
        .set("X-Forwarded-For", ip)
        .send({ email: "nobody@vybe.com", password: "wrong-password" });
    // Visitor 1: five wrong passwords, a normal 401 each time
    for (let attempt = 1; attempt <= 5; attempt++) {
      const res = await tryLoginFrom("10.0.0.1");
      expect(res.status).toBe(401);
    }
    // Visitor 1, sixth try: the limiter answers before the controller runs
    const blocked = await tryLoginFrom("10.0.0.1");
    expect(blocked.status).toBe(429);

    // Visitor 2 is a different person, so their count is still zero
    const other = await tryLoginFrom("10.0.0.2");
    expect(other.status).toBe(401);
  });
});
