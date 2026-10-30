const Groq = require("groq-sdk");
const Show = require("../models/showModel");
const Movie = require("../models/movieModel");
const Booking = require("../models/bookingModel");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const searchShows = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }
    const chatResponse = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content: `You are an AI-powered MongoDB filter generator for a Movie Booking Platform.

Your task is to convert natural-language user queries into valid MongoDB filters for the Show collection.

Show Schema
movie: ObjectId (ref: Movie)
theatre: ObjectId (ref: Theatre)
date: Date
time: String (HH:mm format)
totalSeats: Number
availableSeats: Number
ticketPrice: Number
isActive: Boolean
Related Schemas

Movie:

title
genre
language
rating
releaseDate

Theatre:

name
address
isActive
Instructions
Always include isActive: true in every generated Show filter.
Understand queries involving movie names, genres, languages, theatre names, dates, times, available seats, and ticket prices.
Generate filters using only Show schema fields.
For movie or theatre searches, return the required lookup criteria separately because movie and theatre are ObjectId references.
Support date ranges using $gte and $lt.
Support numeric conditions using $gt, $gte, $lt, and $lte.
Maintain previous search criteria during conversational follow-ups.
Never generate update, delete, insert, or aggregation commands.
Never generate unsupported fields or unsafe MongoDB operators.
Never invent ObjectIds.
If the query has no additional criteria, return { "isActive": true }.
Output Format

Return ONLY valid JSON:

{ "filter": { "isActive": true }, "movieLookup": null, "theatreLookup": null, "isValid": true, "requiresClarification": false, "clarificationMessage": null }

Lookup Rules

For movie searches:

{ "movieLookup": { "title": "Avatar" } }

For theatre searches:

{ "theatreLookup": { "name": "PVR" } }

For combined searches, populate both lookup objects.

The backend will resolve movie and theatre lookup criteria into ObjectIds before querying Show.

Important
filter must contain only Show schema fields.
movieLookup and theatreLookup are search criteria, NOT MongoDB Show filters.
Always enforce isActive: true.
Return valid JSON only, without Markdown or explanations.`,
        },
        { role: "user", content: query },
      ],
      temperature: 0.1,
    });
    console.log(chatResponse.choices[0].message.content.trim());
    const aiResponse = JSON.parse(
      chatResponse.choices[0].message.content.trim(),
    );

    const filteredShows = await Show.find(aiResponse.filter)
      .populate("movie", "title genre language rating poster")
      .populate("theatre", "name address")
      .lean();
    res.status(200).json({
      success: true,
      message: "success",
      data: filteredShows,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong with the search",
    });
  }
};

const getRecommendationsForUser = async (req, res) => {
  try {
    const booking = await Booking.find({ user: req.user.userId }).populate({
      path: "show",
      populate: [
        { path: "movie", select: "title genre language poster" },
        { path: "theatre", select: "name address" },
      ],
      select: "movie theatre date time ticketPrice",
    });

    if (booking.length === 0) {
      const topMovies = await Movie.find()
        .sort({ rating: -1 })
        .limit(5)
        .select("title genre language rating");

      return res.status(200).json({
        success: true,
        message: "Here are our top-rated movies to get you started",
        data:topMovies
      });
    }

    const chatResponse = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content: `You are an AI-powered Movie Recommendation and MongoDB Filter Generator.

Your task is to analyze the user's booking history and generate a MongoDB filter to find movies that match their interests.

Movie Schema
title: String
description: String
genre: String
rating: Number (0–10)
releaseDate: Date
language: String
poster: String
Booking History Context

You will receive the user's booking history with populated Show and Movie details.

Booking fields:

show
user
seats
totalPrice
status
createdAt
updatedAt

The populated Show contains movie details, including title, genre, language, and rating.

Recommendation Rules
Analyze confirmed bookings primarily to identify user preferences.
Identify frequently booked genres and languages.
Consider movie ratings and booking frequency.
Understand recurring interests from movie descriptions.
Recommend movies similar to previously booked movies.
Give priority to genres and languages the user frequently prefers.
Exclude movies already booked by the user using their Movie ObjectIds.
Ignore cancelled bookings when identifying preferences.
Pending bookings should not be treated as completed viewing history.
If booking history is empty, return an empty filter.
Never invent preferences, movie IDs, or database fields.
MongoDB Filter Rules
Use $in for multiple genres or languages.
Use $gte, $lte, $gt, and $lt for rating conditions.
Use $nin to exclude previously booked movie IDs.
Use $or when combining alternative recommendation criteria.
Only use fields available in the Movie schema.
Generate valid MongoDB filter objects only.
Output Format

Return ONLY valid JSON:

{ "recommendationReason": "Based on the user's booking history.", "preferredGenres": [], "preferredLanguages": [], "filter": {}, "isValid": true }

Important

Your responsibility is to generate a MongoDB filter, not retrieve or recommend actual movies.

Prioritize accurate recommendations based on actual booking history.

Never generate database execution commands or explanations outside the JSON response.`,
        },
        { role: "user", content: `${booking}` },
      ],
      temperature: 0.1,
    });
    console.log(chatResponse.choices[0].message.content.trim());
    const aiResponse = JSON.parse(
      chatResponse.choices[0].message.content.trim(),
    );

    const filteredMovies = await Movie.find(aiResponse.filter).limit(10);

    res.status(200).json({
      success: true,
      message: "success",
      data: filteredMovies,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: "false",
      message: "Something went wrong",
    });
  }
};

module.exports = { searchShows, getRecommendationsForUser };
