import { useEffect, useMemo, useState } from "react";
import { authFetch } from "../api";
import CreateIdea from "../components/CreateIdea";
import IdeasList from "../components/IdeasList";
import SortControls from "../components/SortControls";

export default function Dashboard() {
  const [ideas, setIdeas] = useState([]);
  const [sortBy, setSortBy] = useState("votes");

  const loadIdeas = async () => {
    const res = await authFetch("http://127.0.0.1:8000/api/ideas/");
    const data = await res.json();
    setIdeas(data);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      loadIdeas();
    }
  }, []);

  const vote = async (id) => {
    await authFetch(`http://127.0.0.1:8000/api/ideas/${id}/vote/`, {
      method: "POST",
    });
    loadIdeas();
  };

  const unvote = async (id) => {
    await authFetch(`http://127.0.0.1:8000/api/ideas/${id}/unvote/`, {
      method: "DELETE",
    });
    loadIdeas();
  };

  // Defensive: ensure we always work with an array. Some API responses
  // may return an object (e.g. { results: [...] }) or null on error.
  const ideaArray = Array.isArray(ideas)
    ? ideas
    : ideas && ideas.results
      ? ideas.results
      : [];

  const sortedIdeas = useMemo(
    () =>
      [...ideaArray].sort((a, b) => {
        if (sortBy === "votes")
          return (b.vote_count || 0) - (a.vote_count || 0);
        if (sortBy === "newest")
          return new Date(b.created_at) - new Date(a.created_at);
        return 0;
      }),
    [ideaArray, sortBy],
  );

  const totalIdeas = ideaArray.length;
  const totalVotes = ideaArray.reduce(
    (sum, idea) => sum + (idea.vote_count || 0),
    0,
  );
  const recentIdeas = ideaArray.filter((idea) => {
    if (!idea || !idea.created_at) return false;
    const created = new Date(idea.created_at);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return created >= sevenDaysAgo;
  }).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.24em] text-cyan-300/80">
              Community voting board
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Ideas Dashboard
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Track submissions, explore the top ideas, and vote on what matters
              most.
            </p>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
            className="inline-flex items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-400/40 hover:bg-cyan-500/20"
          >
            Logout
          </button>
        </header>

        <div className=" top-6 rounded-3xl border border-white/10 bg-slate-900/80 p-6 m-10 shadow-2xl shadow-slate-950/30">
          <CreateIdea onCreated={loadIdeas} />
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-slate-900/75 p-5 shadow-lg shadow-slate-950/30">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
              Total ideas
            </p>
            <p className="mt-4 text-4xl font-semibold text-white">
              {totalIdeas}
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Fresh ideas in the last 7 days: {recentIdeas}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/75 p-5 shadow-lg shadow-slate-950/30">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
              Total votes
            </p>
            <p className="mt-4 text-4xl font-semibold text-white">
              {totalVotes}
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Sorted by {sortBy === "votes" ? "top support" : "newest"}.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/15 to-slate-900/40 p-5 shadow-lg shadow-cyan-500/10">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-200/70">
              Quick actions
            </p>
            <p className="mt-4 text-4xl font-semibold text-white">
              Create + Vote
            </p>
            <p className="mt-2 text-sm text-slate-300">
              Add your next idea and keep the community momentum going.
            </p>
          </div>
        </section>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_0.9fr]">
          <main className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/30">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-cyan-300/80">
                    Idea feed
                  </p>
                  <h2 className="text-2xl font-semibold text-white">
                    Top community ideas
                  </h2>
                </div>
                <p className="text-sm text-slate-400">
                  {sortedIdeas.length} ideas ready for voting.
                </p>
              </div>
            </div>

            {sortedIdeas.length ? (
              <IdeasList ideas={sortedIdeas} onVote={vote} onUnvote={unvote} />
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/70 p-10 text-center text-slate-300 ">
                <p className="text-lg font-medium text-white">No ideas yet</p>
                <p className="mt-2 text-sm text-slate-400">
                  Add the first idea using the panel on the right to get
                  started.
                </p>
              </div>
            )}
          </main>

          <aside className="space-y-6 ">
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/30">
              <SortControls sortBy={sortBy} setSortBy={setSortBy} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
