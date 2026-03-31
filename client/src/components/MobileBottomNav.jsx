import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

const homeIcon = (
  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5.5 9.5V20H18.5V9.5" />
  </svg>
);

const cartIcon = (
  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M3 4h2l2.4 10.2a1 1 0 0 0 1 .8H18a1 1 0 0 0 1-.8L21 7H7" />
    <circle cx="10" cy="19" r="1.4" />
    <circle cx="18" cy="19" r="1.4" />
  </svg>
);

const orderIcon = (
  <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M6 4h12v16H6z" />
    <path d="M9 8h6M9 12h6M9 16h4" />
  </svg>
);

const navItems = [
  { to: "/", label: "Home", icon: homeIcon },
  { to: "/cart", label: "Cart", icon: cartIcon },
  { to: "/orders", label: "Orders", icon: orderIcon },
];

function MobileBottomNav() {
  const { cartCount } = useCart();

  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 lg:hidden">
      <div className="glass-panel mx-auto flex max-w-[20rem] items-center justify-between rounded-[18px] border border-slate-200 px-1 py-0.5 shadow-[0_14px_40px_rgba(15,23,42,0.08)]">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `relative flex min-w-[3.35rem] flex-col items-center gap-0.5 rounded-[13px] px-2 py-1 text-[9px] font-medium leading-none transition ${
                isActive ? "bg-slate-900 text-white" : "text-slate-600"
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
            {item.to === "/cart" && cartCount > 0 ? (
              <span className="absolute right-0.5 top-0.5 rounded-full bg-slate-900 px-1 py-[1px] text-[7px] text-white">
                {cartCount}
              </span>
            ) : null}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default MobileBottomNav;
