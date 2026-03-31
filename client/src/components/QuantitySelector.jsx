function QuantitySelector({ value, onDecrease, onIncrease, compact = false, disabled = false }) {
  const buttonClassName = compact ? "h-10 w-10" : "h-12 w-12";

  return (
    <div className={`inline-flex items-center rounded-2xl border border-slate-200 bg-white ${disabled ? "opacity-60" : ""}`}>
      <button
        type="button"
        onClick={onDecrease}
        disabled={disabled}
        className={`${buttonClassName} text-xl font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed`}
      >
        -
      </button>
      <span className="min-w-[3rem] text-center text-base font-semibold text-slate-900">{value}</span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={disabled}
        className={`${buttonClassName} text-xl font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed`}
      >
        +
      </button>
    </div>
  );
}

export default QuantitySelector;
