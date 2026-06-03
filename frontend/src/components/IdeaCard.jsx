export default function IdeaCard({ idea, onVote, onNoVote, onUnvote }) {
  const yesVotes = idea.yes_votes ?? 0;
  const noVotes = idea.no_votes ?? 0;
  const totalVotes = idea.vote_count ?? yesVotes + noVotes;
  const supportRate = totalVotes
    ? Math.round((yesVotes / totalVotes) * 100)
    : 0;

  return (
    <article className="group mb-10 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/85 p-6 shadow-xl shadow-slate-950/20 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-500/30">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-white">{idea.title}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            {idea.description}
          </p>
        </div>

        <span className="whitespace-nowrap rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
          {idea.has_voted ? "Voted" : "Vote"}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-slate-950/80 p-4 text-center">
          <p className="text-2xl font-semibold text-white">{totalVotes}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-400">
            Total votes
          </p>
        </div>
        <div className="rounded-2xl bg-slate-950/80 p-4 text-center">
          <p className="text-2xl font-semibold text-emerald-400">
            {idea.yes_votes ?? 0}
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-400">
            Yes
          </p>
        </div>
        <div className="rounded-2xl bg-slate-950/80 p-4 text-center">
          <p className="text-2xl font-semibold text-rose-400">
            {idea.no_votes ?? 0}
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-400">
            No
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-slate-950/80 p-4">
        <div className="flex items-center justify-between text-sm text-slate-300">
          <span>Community approval</span>
          <span>{supportRate}%</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-cyan-400 transition-all duration-300"
            style={{ width: `${supportRate}%` }}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={() => onVote(idea.id)}
          className="inline-flex min-w-[120px] items-center justify-center rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
        >
          Yes
        </button>
        <button
          onClick={() => onNoVote(idea.id)}
          className="inline-flex min-w-[120px] items-center justify-center rounded-2xl bg-slate-500 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
        >
          No
        </button>
        {idea.has_voted ? (
          <button
            onClick={() => onUnvote(idea.id)}
            className="inline-flex min-w-[120px] items-center justify-center rounded-2xl bg-slate-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-600"
          >
            Clear vote
          </button>
        ) : null}

        <span className="inline-flex items-center justify-center rounded-2xl bg-slate-950/80 px-4 py-2 text-sm text-slate-300">
          {new Date(idea.created_at).toLocaleDateString()}
        </span>
      </div>
    </article>
  );
}
