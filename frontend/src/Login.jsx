import { useState } from "react";
import { API_BASE_URL } from "./api";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch (err) {
        data = {};
      }

      if (res.ok) {
        localStorage.setItem("token", data.token);
        onLogin(data.token);
      } else if (res.status === 401 || res.status === 403) {
        setError("Wrong username or password.");
      } else if (res.status === 400) {
        setError(data.detail || data.error || "Invalid request.");
      } else {
        setError(data.detail || data.error || `Login failed (${res.status})`);
      }
    } catch (err) {
      console.error("Login request failed:", err);
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-300/80">
            Community voting board
          </p>
          <h2 className="text-2xl font-semibold text-white">Sign in</h2>
          <p className="mt-2 text-sm text-slate-300">
            Enter your credentials to access the Ideas Dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-900/60 border border-red-500/20 p-3 text-red-200">
              {error}
            </div>
          )}
          <label className="block">
            <span className="sr-only">Username</span>
            <input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-800/60 px-4 py-3 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
            />
          </label>

          <label className="block">
            <span className="sr-only">Password</span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-800/60 px-4 py-3 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
            />
          </label>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className={`inline-flex items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-400/40 hover:bg-cyan-500/20 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
