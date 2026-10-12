require("dotenv").config();

const mongoose = require("mongoose");

const User = require("./models/userModel");

const Movie = require("./models/movieModel");

const Theatre = require("./models/theatreModel");

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to MongoDB");

    // Clear existing data

    await User.deleteMany({});

    await Movie.deleteMany({});

    await Theatre.deleteMany({});

    console.log("Cleared existing data");

    // Create a partner user

    const partner = await User.create({
      name: "Rajesh Kumar",

      email: "rajesh@example.com",

      password: "password123",

      role: "partner",
    });

    console.log("Created partner:", partner.name);

    // Create a movie

    const movie = await Movie.create({
      title: "Inception",

      description:
        "A thief who steals corporate secrets through dream-sharing technology.",

      genre: "Sci-Fi",

      language: "English",

      releaseDate: new Date("2010-07-16"),

      rating: 8.8,

      poster: "https://example.com/inception.jpg",
    });

    console.log("Created movie:", movie.title);

    // Create a theatre owned by the partner

    const theatre = await Theatre.create({
      name: "PVR Phoenix",

      address: "Phoenix Mall, Lower Parel, Mumbai",

      phone: "9876543210",

      email: "pvr.phoenix@example.com",

      owner: partner._id,
    });

    console.log("Created theatre:", theatre.name);

    console.log("Theatre owner ID:", theatre.owner);

    console.log("Partner _id:", partner._id);

    console.log(
      "Owner matches partner:",

      theatre.owner.toString() === partner._id.toString(),
    );

    console.log("\nSeed data created successfully!");

    process.exit(0);
  } catch (err) {
    console.log("Error seeding data:", err.message);

    process.exit(1);
  }
};

seedData();
