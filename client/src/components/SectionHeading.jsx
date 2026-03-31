import { Link } from "react-router-dom";

function SectionHeading({ eyebrow, title, description, actionLabel, actionTo }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500 sm:mb-2 sm:text-xs sm:tracking-[0.28em]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="font-display text-xl font-semibold text-slate-900 sm:text-4xl">{title}</h2>
        {description ? <p className="mt-2 text-xs leading-6 text-slate-600 sm:mt-3 sm:text-base sm:leading-7">{description}</p> : null}
      </div>
      {actionLabel && actionTo ? (
        <Link
          to={actionTo}
          className="ghost-button self-start px-3.5 py-2 text-center text-xs sm:px-5 sm:py-3 sm:text-base"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

export default SectionHeading;
