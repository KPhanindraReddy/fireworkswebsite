export const PageSpinner = ({ label = "Loading" }) => (
  <div className="flex min-h-[55vh] flex-col items-center justify-center gap-4 px-4 text-center">
    <div className="h-14 w-14 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
    <p className="text-sm font-medium text-slate-600">{label}</p>
  </div>
);

export const ProductGridSkeleton = () => (
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    {Array.from({ length: 8 }).map((_, index) => (
      <div
        key={index}
        className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.05)]"
      >
        <div className="aspect-square animate-pulse rounded-[22px] bg-slate-100" />
        <div className="mt-4 h-4 animate-pulse rounded bg-slate-100" />
        <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-slate-100" />
        <div className="mt-5 h-12 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    ))}
  </div>
);
