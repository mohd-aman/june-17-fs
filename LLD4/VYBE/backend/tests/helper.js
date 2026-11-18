const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Movie = require("../models/movieModel");
const Theatre = require("../models/theatreModel");
const Show = require("../models/showModel");

let counter = 0;

// A user in the test database, plus a token signed the same way login signs it
const createUserAndToken = async (role = "user") => {
  counter += 1;
  const user = await User.create({
    name: `Test ${role} ${counter}`,
    email: `${role}${counter}@test.com`,
    password: "not-used-in-these-tests",
    role,
  });
  const token = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );
  return { user, token };
};

// A movie, an approved theatre and an active show, ready to book
const createShow = async ({ availableSeats = 10 } = {}) => {
  const { user: partner } = await createUserAndToken("partner");
  const movie = await Movie.create({
    title: "Drishyam 3",
    description: "A family thriller",
    genre: "Thriller",
    language: "Hindi",
    releaseDate: new Date("2026-10-02"),
  });
  const theatre = await Theatre.create({
    name: "Starlight Cinema",
    address: "FC Road, Pune",
    phone: "9876543210",
    email: "starlight@test.com",
    owner: partner._id,
    isActive: true,
  });
  return Show.create({
    movie: movie._id,
    theatre: theatre._id,
    date: new Date(Date.now() + 24 * 60 * 60 * 1000),
    time: "18:00",
    totalSeats: availableSeats,
    availableSeats,
    ticketPrice: 250,
    isActive: true,
  });
};
module.exports = { createUserAndToken, createShow };
