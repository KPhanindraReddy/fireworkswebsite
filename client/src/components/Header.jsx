import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

const CartIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M3 4h2l2.4 10.2a1 1 0 0 0 1 .8H18a1 1 0 0 0 1-.8L21 7H7" />
    <circle cx="10" cy="19" r="1.4" />
    <circle cx="18" cy="19" r="1.4" />
  </svg>
);

const navLinkClasses = ({ isActive }) =>
  `rounded-full px-2.5 py-1 text-[13px] font-medium transition ${
    isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
  }`;

function Header() {
  const { cartCount } = useCart();

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6 lg:px-8">
      <div className="glass-panel mx-auto max-w-7xl rounded-[26px] border border-slate-200 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:rounded-[32px]">
        <div className="flex items-center gap-2 px-3 py-2 sm:gap-3 sm:px-6 sm:py-4">
          <NavLink to="/" className="min-w-0 flex-1">
            <div className="truncate whitespace-nowrap font-display text-[13px] font-medium leading-none tracking-[0.01em] text-slate-900 sm:text-xl">
              SkyBurst Store
            </div>
          </NavLink>

          <nav className="hidden items-center gap-2 lg:flex">
            <NavLink to="/" className={navLinkClasses}>
              Home
            </NavLink>
            <NavLink to="/products" className={navLinkClasses}>
              Products
            </NavLink>
            <NavLink to="/orders" className={navLinkClasses}>
              Orders
            </NavLink>
            <NavLink to="/admin" className={navLinkClasses}>
              Admin
            </NavLink>
          </nav>

          <NavLink
            to="/cart"
            className="ml-auto inline-flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-1.5 text-[11px] font-medium text-white transition hover:bg-slate-800 sm:gap-3 sm:px-4 sm:py-3 sm:text-sm"
          >
            <CartIcon />
            <span className="leading-none">Cart</span>
            <span className="rounded-full bg-white/15 px-1.5 py-0.5 text-[9px] leading-none sm:px-2 sm:py-1 sm:text-xs">
              {cartCount}
            </span>
          </NavLink>
        </div>
      </div>
    </header>
  );
}

export default Header;
