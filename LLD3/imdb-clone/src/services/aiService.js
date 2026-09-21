const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

async function getRecommendation(watchlist) {
  // ['spider','alien','resident evil'].join(", ") - "spider, alien, resident evil"
  const titles = watchlist.map((movie) => movie.title).join(", ");
  const prompt = `I have these movies in my watchlist: ${titles}. Based on my taste, suggest 3 movies I would enjoy that are NOT in my list. For each suggestion, give the movie name and one sentence explaining why I would like it. Keep it short.`;
  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content:
            "You are a movie recommendation assistant. Be concise and helpful.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    console.error("Groq API error:", response.status, errBody);
    throw new Error("Failed to get recommendations");
  }

  const data = await response.json();
  return data.choices[0].message.content;
}


export default {getRecommendation}