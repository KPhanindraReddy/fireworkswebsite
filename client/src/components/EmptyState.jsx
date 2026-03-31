import { Link } from "react-router-dom";

function EmptyState({ title, description, actionLabel, actionTo }) {
  return (
    <div className="surface-panel flex min-h-[18rem] flex-col items-center justify-center rounded-[32px] border border-white/50 px-6 py-10 text-center shadow-glow">
      <div className="rounded-full bg-orange-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-orange-700">
        Nothing here yet
      </div>
      <h2 className="mt-5 font-display text-3xl font-bold text-slate-900">{title}</h2>
      <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">{description}</p>
      {actionLabel && actionTo ? (
        <Link to={actionTo} className="warm-button mt-6">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

export default EmptyState;
