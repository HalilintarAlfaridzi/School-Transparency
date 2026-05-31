import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "../components/navigation/DashboardSidebar";
import { roleLabels } from "../constants/routes";
import { useAuth } from "../contexts/AuthContext";

export function DashboardLayout() {
  const { role, user } = useAuth();

  return (
    <div className="min-h-screen bg-surface lg:flex">
      <DashboardSidebar />
      <main className="min-w-0 flex-1">
        <div className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{roleLabels[role]}</p>
              <h1 className="text-xl font-bold text-slate-950">{user?.fullName}</h1>
            </div>
          </div>
        </div>
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
