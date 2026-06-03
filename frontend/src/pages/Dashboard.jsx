import { useEffect, useMemo, useState } from "react";
import { authFetch, API_BASE_URL } from "../api";
import CreateIdea from "../components/CreateIdea";
import IdeasList from "../components/IdeasList";
import SortControls from "../components/SortControls";

export default function Dashboard() {
  const [ideas, setIdeas] = useState([]);
  const [sortBy, setSortBy] = useState("votes");

  const normalizeIdeas = (data) =>
    Array.isArray(data)
      ? data
      : Array.isArray(data?.results)
        ? data.results
        : [];

  const loadIdeas = async () => {
    try {
      const res = await authFetch(`${API_BASE_URL}/api/ideas/`);

      if (!res.ok) {
        setIdeas([]);
        return;
      }

      const data = await res.json().catch(() => null);
      setIdeas(normalizeIdeas(data));
    } catch {
      setIdeas([]);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    (async () => {
      try {
        const res = await authFetch(`${API_BASE_URL}/api/ideas/`);

        if (!res.ok) {
          setIdeas([]);
          return;
        }

        const data = await res.json().catch(() => null);
        setIdeas(normalizeIdeas(data));
      } catch {
        setIdeas([]);
      }
    })();
  }, []);

  const sendVote = async (id, choice) => {
    const res = await authFetch(`${API_BASE_URL}/api/ideas/${id}/vote/`, {
      method: "POST",
      body: JSON.stringify({ choice }),
    });

    if (res.ok) {
      loadIdeas();
    }
  };

  const vote = async (id) => sendVote(id, "Y");
  const voteNo = async (id) => sendVote(id, "N");
  const unvote = async (id) => {
    const res = await authFetch(`${API_BASE_URL}/api/ideas/${id}/unvote/`, {
      method: "DELETE",
    });

    if (res.ok) {
      loadIdeas();
    }
  };

  const ideaArray = useMemo(
    () =>
      Array.isArray(ideas)
        ? ideas
        : ideas && ideas.results
          ? ideas.results
          : [],
    [ideas],
  );

  const sortedIdeas = useMemo(
    () =>
      [...ideaArray].sort((a, b) => {
        if (sortBy === "votes") return (b.yes_count || 0) - (a.yes_count || 0);
        if (sortBy === "newest")
          return new Date(b.created_at) - new Date(a.created_at);
        return 0;
      }),
    [ideaArray, sortBy],
  );

  const totalIdeas = ideaArray.length;
  const totalVotes = ideaArray.reduce(
    (sum, idea) => sum + (idea.yes_count || 0),
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
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 text-left">
        <header className="mb-8 flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between text-left">
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

        <div className="top-6 rounded-3xl border border-white/10 bg-slate-900/80 p-6 mb-6 shadow-2xl shadow-slate-950/30 text-left">
          <CreateIdea onCreated={loadIdeas} />
        </div>

        <section className="grid gap-4 md:grid-cols-3 text-left">
          <div className="rounded-3xl border border-white/10 bg-slate-900/75 p-5 shadow-lg shadow-slate-950/30 text-left">
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
              Sorted by {sortBy === "votes" ? "top votes" : "newest"}.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/15 to-slate-900/40 p-5 shadow-lg shadow-cyan-500/10 text-left">
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
              <IdeasList
                ideas={sortedIdeas}
                onVote={vote}
                onNoVote={voteNo}
                onUnvote={unvote}
              />
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/70 p-10 text-left text-slate-300">
                <p className="text-lg font-medium text-white">No ideas yet</p>
                <p className="mt-2 text-sm text-slate-400">
                  No Ideas have been submitted yet. Be the first to share your
                  idea and inspire the community!
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
