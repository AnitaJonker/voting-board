const options = [
  { value: "votes", label: "Top votes" },
  { value: "newest", label: "Newest" },
];

export default function SortControls({ sortBy, setSortBy }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/85 p-6 shadow-2xl shadow-slate-950/20">
      <div className="mb-5">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-300/80">
          Sort ideas
        </p>
        <p className="mt-2 text-sm text-slate-300">
          Order the idea feed for the best view.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const isActive = sortBy === option.value;
          return (
            <button
              key={option.value}
              onClick={() => setSortBy(option.value)}
              className={`rounded-full px-5 py-3 text-sm font-semibold transition duration-200 ${
                isActive
                  ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
                  : "bg-slate-950/80 text-slate-300 hover:bg-slate-900"
              }`}
              aria-pressed={isActive}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
