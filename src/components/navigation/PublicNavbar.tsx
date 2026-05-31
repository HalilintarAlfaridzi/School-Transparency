import { Menu, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/Button";

const links = [
  { to: "/", label: "Beranda" },
  { to: "/transparency", label: "Dashboard" },
  { to: "/reports", label: "Laporan" },
  { to: "/statistics", label: "Statistik" },
  { to: "/timeline", label: "Timeline" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Kontak" },
];

export function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, role } = useAuth();
  const dashboardHref = role === "guest" ? "/login" : `/${role}`;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="page-container flex h-16 items-center justify-between gap-4">
        <NavLink to="/" className="flex items-center gap-3 font-bold text-slate-950">
          <img src="/school-mark.svg" alt="" className="h-9 w-9 rounded-md" />
          <span>School Transparency</span>
        </NavLink>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigasi publik">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium ${
                  isActive ? "bg-blue-50 text-trust" : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <Button variant="secondary" to={dashboardHref} icon={<ShieldCheck size={16} />}>
            {isAuthenticated ? "Dashboard Saya" : "Login"}
          </Button>
        </div>
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-300 lg:hidden"
          type="button"
          aria-label="Buka navigasi"
          onClick={() => setIsOpen((value) => !value)}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {isOpen && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="page-container grid gap-1 py-3">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `rounded-md px-3 py-3 text-sm font-medium ${
                    isActive ? "bg-blue-50 text-trust" : "text-slate-700"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Button className="mt-2 w-full" variant="secondary" to={dashboardHref}>
              {isAuthenticated ? "Dashboard Saya" : "Login"}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
