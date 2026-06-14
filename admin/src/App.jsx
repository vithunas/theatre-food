import { NavLink, Route, Routes } from "react-router-dom";
import { LayoutDashboard, ReceiptText, UtensilsCrossed, Settings, ExternalLink, Clapperboard } from "lucide-react";
import { getSettings } from "@shared/data.js";
import { useLive } from "./lib/useLive.js";
import Overview from "./pages/Overview.jsx";
import Orders from "./pages/Orders.jsx";
import Menu from "./pages/Menu.jsx";
import SettingsPage from "./pages/Settings.jsx";

const NAV = [
  { to: "/", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/orders", label: "Orders", icon: ReceiptText },
  { to: "/menu", label: "Menu", icon: UtensilsCrossed },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function App() {
  const settings = useLive(() => getSettings());

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-20 border-b border-hairline bg-base/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-3">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-elevated text-gold">
              <Clapperboard size={17} />
            </span>
            <div className="leading-tight">
              <p className="text-sm text-primary">{settings.theatreName}</p>
              <p className="text-xs text-muted">Staff portal</p>
            </div>
          </div>

          <nav className="flex items-center gap-1">
            {NAV.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className="block">
                {({ isActive }) => (
                  <span data-active={isActive} className="nav-link flex items-center gap-2 px-3 py-2 text-sm">
                    <Icon size={15} /> {label}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-4 text-xs">
            <a href="http://localhost:5175" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-muted transition-colors hover:text-gold">
              Kitchen display <ExternalLink size={12} />
            </a>
            <a href="http://localhost:5173" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-muted transition-colors hover:text-gold">
              Customer portal <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-7">
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  );
}
