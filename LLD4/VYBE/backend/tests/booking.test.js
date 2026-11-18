const request = require("supertest");
const app = require("../app");
const Show = require("../models/showModel");
const { createUserAndToken, createShow } = require("./helper");

const book = (token, showId, seats) =>
  request(app)
    .post("/api/bookings")
    .set("Authorization", `Bearer ${token}`)
    .send({ showId, seats });

describe("POST /api/bookings", () => {
  test("books seats and takes them off the show", async () => {
    // Arrange
    const { token } = await createUserAndToken("user");
    const show = await createShow({ availableSeats: 10 });
    // Act
    const res = await book(token, show._id, 2);
    // Assert
    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe("pending");
    const updated = await Show.findById(show._id);
    expect(updated.availableSeats).toBe(8);
  });

  test("five users, three seats: nobody gets a seat that does not exist", async () => {
    // Arrange: a show with 3 seats and 5 different users
    const show = await createShow({ availableSeats: 3 });
    const users = await Promise.all(
      [1, 2, 3, 4, 5].map(() => createUserAndToken("user")),
    );

    // Act: all five press Book at the same moment
    const responses = await Promise.all(
      users.map(({ token }) => book(token, show._id, 1)),
    );

    // Assert: the database is the judge, so check it first
    const updated = await Show.findById(show._id);
    expect(updated.availableSeats).toBe(0);

    const statuses = responses.map((r) => r.status);
    expect(statuses.filter((s) => s === 201)).toHaveLength(3);
    expect(statuses.filter((s) => s !== 201)).toHaveLength(2);
  });
});
