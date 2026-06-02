import { useState } from "react";
import { authFetch } from "../api";

export default function CreateIdea({ onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authFetch("http://127.0.0.1:8000/api/ideas/", {
        method: "POST",
        body: JSON.stringify({ title, description }),
      });

      setTitle("");
      setDescription("");
      onCreated?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/85 p-6 shadow-2xl shadow-slate-950/20 mb-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-300/80">
            New idea
          </p>
          <h1 className="text-2xl font-semibold text-white">Create idea</h1>
        </div>
        <div className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
          + Add
        </div>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <input
          className="w-full rounded-2xl border border-slate-700/80 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
          placeholder="Idea title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full rounded-2xl border border-slate-700/80 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 min-h-[120px] resize-none outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
          placeholder="Describe your idea..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-400/40 ${
            loading
              ? "bg-slate-700 text-slate-400 cursor-not-allowed"
              : "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
          }`}
        >
          {loading ? "Creating..." : "Create idea"}
        </button>
      </form>
    </div>
  );
}
