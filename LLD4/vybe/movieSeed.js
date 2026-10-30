
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
require("dotenv").config();

// Import your Movie model
const Movie = require("./models/movieModel");

const genres = [
  "Action",
  "Comedy",
  "Drama",
  "Horror",
  "Sci-Fi",
  "Romance",
  "Thriller",
  "Documentary",
];

const languages = [
  "English",
  "Hindi",
  "Spanish",
  "French",
  "Japanese",
  "Korean",
  "German",
  "Chinese",
];

const generateMovies = (count) => {
  const movies = [];

  for (let i = 0; i < count; i++) {
    movies.push({
      title: faker.word.words({ count: { min: 2, max: 4 } }),
      description: faker.lorem.paragraph(),
      genre: faker.helpers.arrayElement(genres),
      rating: Number(faker.number.float({
        min: 0,
        max: 10,
        fractionDigits: 1,
      })),
      releaseDate: faker.date.between({
        from: "1980-01-01",
        to: "2026-10-30",
      }),
      language: faker.helpers.arrayElement(languages),
      poster: faker.image.url(),
    });
  }

  return movies;
};

const seedMovies = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected!");

    // Generate 100 movies
    const movies = generateMovies(100);

    // Insert movies into database
    await Movie.insertMany(movies);

    console.log("100 movies inserted successfully!");

  } catch (error) {
    console.error("Error seeding movies:", error);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
};

seedMovies();
