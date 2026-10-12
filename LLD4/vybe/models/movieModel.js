const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required:true,
    },
    genre: {
      type: String,
      required: true,
      enum: [
        "Action",
        "Comedy",
        "Drama",
        "Horror",
        "Sci-Fi",
        "Romance",
        "Thriller",
        "Documentary"
      ],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    language: {
      type: String,
      required:true,
      default: "English",
    },
    poster:{
      type:String,
      default:""
    }
  },
  {
    timestamps: true,
  },
);

const Movie = mongoose.model("Movie",movieSchema);

module.exports = Movie