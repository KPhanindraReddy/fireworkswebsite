import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import MobileBottomNav from "./MobileBottomNav.jsx";

function AppLayout() {
  return (
    <div className="min-h-screen">
      <div className="fixed inset-x-0 top-0 -z-10 h-[18rem] bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.12),_transparent_60%)]" />
      <Header />
      <main className="mx-auto w-full max-w-7xl px-4 pb-24 pt-5 sm:px-6 sm:pt-6 lg:px-8 lg:pb-12">
        <Outlet />
      </main>
      <MobileBottomNav />
    </div>
  );
}

export default AppLayout;
