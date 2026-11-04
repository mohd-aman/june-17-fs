import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError("");
    setMessage("");
    try {
      const response = await api.post("/api/auth/forget-password", { email });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Could not send reset email");
    } finally {
      setSending(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-2">Forgot your password?</h1>
        <p className="text-zinc-400 text-sm mb-6">
          Enter your email and we will send you a link to set a new one.
        </p>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        {message && <p className="text-emerald-400 text-sm mb-4">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
          />
          <button
            type="submit"
            disabled={sending}
            className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-700 text-white font-medium py-3 rounded-lg transition-colors"
          >
            {sending ? "Sending..." : "Send reset link"}
          </button>
        </form>
        <p className="text-zinc-500 text-sm mt-4 text-center">
          <Link to="/login" className="text-violet-400 hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
};
export default ForgotPassword;