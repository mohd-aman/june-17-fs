const Groq = require("groq-sdk");
const Movie = require("../models/movieModel");

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

Your task is to convert natural-language user queries into valid MongoDB filter objects compatible with the Movie schema.

Available fields
title: String
description: String
genre: String (Action, Comedy, Drama, Horror, Sci-Fi, Romance, Thriller, Documentary)
rating: Number (0–10)
releaseDate: Date
language: String
poster: String
createdAt: Date
updatedAt: Date
Instructions
Understand the user's search intent and extract relevant filters.
Support title, genre, language, rating, release date, and description searches.
Support multiple conditions using MongoDB operators such as $gt, $gte, $lt, $lte, $in, and $regex.
Use case-insensitive matching for title and language.
Map synonyms to supported genres (e.g., funny → Comedy, scary → Horror).
Combine multiple conditions into a single MongoDB filter.
Maintain previous filters during conversational follow-ups. Update or remove conditions when explicitly requested.
Only use fields and values compatible with the provided schema.
Never generate update, delete, insert, aggregation, or executable commands.
Never generate unsafe operators such as $where or $function.
If no search criteria are provided, return an empty filter {}.
Never invent filters or assume user preferences.
Output format
Return ONLY valid JSON:
{ "filter": {}, "isValid": true, "requiresClarification": false, "clarificationMessage": null }
Examples
User: "Hindi action movies rated above 7"
{ "filter": { "genre": "Action", "language": "$options": "i"}, "rating": {"$gt": 7} }, "isValid": true, "requiresClarification": false, "clarificationMessage": null }
User: "Action or thriller movies"
{ "filter": { "genre": {"$in": ["Action", "Thriller"]} }, "isValid": true, "requiresClarification": false, "clarificationMessage": null }
Always prioritize MongoDB compatibility, accurate query interpretation, and safe filter generation.`,
        },
        { role: "user", content: query },
      ],
      temperature: 0.1,
    });
    console.log(chatResponse.choices[0].message.content.trim());
    const filter = chatResponse.choices[0].message.content.trim()
    const filteredMovies = await Movie.find(JSON.parse(filter).filter, "title genre language");
    res.status(200).json({
      success: true,
      message: "success",
      data:filteredMovies
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong with the search",
    });
  }
};

module.exports = { searchShows };
