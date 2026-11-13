import { useState } from "react";
import api from "../services/api";
 
const Recommendations = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
 console.log(result);
  const handleGetRecommendations = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/api/ai/recommendations");
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not get recommendations");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">AI Recommendations</h2>
        <button
          onClick={handleGetRecommendations}
          disabled={loading}
          className="bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
        >
          {loading ? "Analyzing..." : "Get Recommendations"}
        </button>
      </div>
 
      {error && <p className="text-red-400 text-sm">{error}</p>}
 
      {result ? (
        <div>
          <p className="text-zinc-500 text-sm mb-3">{result.message}</p>
          <ul className="space-y-3">
            {result.data.map((rec) => (
              <li key={rec.title}>
                <p className="text-white font-medium">{rec.title}</p>
                <p className="text-zinc-400 text-sm">{rec.reason}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-zinc-500 text-sm">
          Click the button to get movie suggestions based on your booking
          history.
        </p>
      )}
    </div>
  );
};
 
export default Recommendations;
