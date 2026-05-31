import { Outlet } from "react-router-dom";
import { PublicNavbar } from "../components/navigation/PublicNavbar";
import { useFinance } from "../contexts/FinanceContext";

export function PublicLayout() {
  const { school } = useFinance();

  return (
    <div className="app-shell">
      <PublicNavbar />
      <main>
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="page-container flex flex-col gap-3 py-8 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 {school?.name ?? "School Transparency"}. Transparansi dana sekolah untuk publik.</p>
          <p>{school?.email ?? "Profil sekolah belum tersedia"}</p>
        </div>
      </footer>
    </div>
  );
}
