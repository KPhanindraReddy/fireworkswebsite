import { Link } from "react-router-dom";

const highlightCards = [
  { label: "Quick checkout", value: "Under 2 mins" },
  { label: "Payment mode", value: "Cash on Delivery" },
  { label: "Order support", value: "Phone-friendly flow" },
];

function HeroBanner() {
  return (
    <section className="overflow-hidden rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(251,191,36,0.18),_transparent_26%),linear-gradient(135deg,_rgba(15,23,42,0.95),_rgba(17,24,39,0.88))] px-6 py-10 shadow-glow sm:px-8 lg:px-10 lg:py-12">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-orange-200">
            Fireworks storefront
          </p>
          <h1 className="font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            Bright festive shopping with a fast COD checkout.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            Browse rockets, fountains, sparklers, combo packs, and celebration kits without creating an
            account first. Add to cart, enter your delivery details, place the order, and get instant order
            confirmation.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/products" className="warm-button text-center">
              Shop Fireworks
            </Link>
            <Link to="/orders" className="ghost-button text-center">
              Track Recent Orders
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {highlightCards.map((card) => (
            <div key={card.label} className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-medium text-slate-300">{card.label}</p>
              <p className="mt-3 font-display text-2xl font-bold text-white">{card.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;
