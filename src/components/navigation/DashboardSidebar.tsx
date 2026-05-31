import {
  BarChart3,
  ClipboardCheck,
  FileClock,
  FileText,
  Home,
  LayoutDashboard,
  ListChecks,
  LogOut,
  PlusCircle,
  ScrollText,
  Settings,
  Shield,
  Upload,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { roleLabels } from "../../constants/routes";
import { useAuth } from "../../contexts/AuthContext";
import type { Role } from "../../types";
import { Button } from "../ui/Button";

const linksByRole: Record<Exclude<Role, "guest">, Array<{ to: string; label: string; icon: typeof Home }>> = {
  parent: [
    { to: "/parent/overview", label: "Overview", icon: LayoutDashboard },
    { to: "/parent/financial-summary", label: "Ringkasan", icon: BarChart3 },
    { to: "/parent/transactions", label: "Transaksi", icon: ScrollText },
    { to: "/parent/reports", label: "Laporan", icon: FileText },
  ],
  treasurer: [
    { to: "/treasurer/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/treasurer/transactions/new", label: "Tambah Transaksi", icon: PlusCircle },
    { to: "/treasurer/transactions", label: "Kelola Transaksi", icon: ScrollText },
    { to: "/treasurer/evidence", label: "Evidence", icon: Upload },
    { to: "/treasurer/approval-requests", label: "Approval", icon: ClipboardCheck },
  ],
  principal: [
    { to: "/principal/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/principal/pending-approvals", label: "Pending Approval", icon: ListChecks },
    { to: "/principal/analytics", label: "Analytics", icon: BarChart3 },
    { to: "/principal/approval-history", label: "History", icon: FileClock },
  ],
  admin: [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/roles", label: "Roles", icon: Shield },
    { to: "/admin/categories", label: "Categories", icon: ListChecks },
    { to: "/admin/school-settings", label: "Settings", icon: Settings },
    { to: "/admin/audit-logs", label: "Audit Logs", icon: FileClock },
  ],
};

export function DashboardSidebar() {
  const { user, role, signOut } = useAuth();
  const links = role === "guest" ? [] : linksByRole[role];

  return (
    <aside className="border-b border-slate-200 bg-white lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
          <img src="/school-mark.svg" alt="" className="h-10 w-10 rounded-md" />
          <div>
            <p className="font-bold text-slate-950">School Transparency</p>
            <p className="text-xs font-medium text-slate-500">{roleLabels[role]}</p>
          </div>
        </div>
        <nav className="flex gap-2 overflow-x-auto px-4 py-4 lg:grid lg:overflow-visible" aria-label="Dashboard">
          <NavLink
            to="/"
            className="flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            <Home size={16} /> Publik
          </NavLink>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ${
                    isActive ? "bg-blue-50 text-trust" : "text-slate-600 hover:bg-slate-100"
                  }`
                }
              >
                <Icon size={16} />
                {link.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="mt-auto hidden border-t border-slate-200 p-4 lg:block">
          <p className="text-sm font-semibold text-slate-900">{user?.fullName}</p>
          <p className="mt-1 text-xs text-slate-500">{user?.email}</p>
          <Button className="mt-4 w-full" variant="secondary" icon={<LogOut size={16} />} onClick={() => void signOut()} to="/">
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
}
