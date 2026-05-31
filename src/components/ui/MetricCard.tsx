import type { ReactNode } from "react";

export function MetricCard({
  title,
  value,
  helper,
  icon,
  accent = "blue",
}: {
  title: string;
  value: string;
  helper: string;
  icon: ReactNode;
  accent?: "blue" | "emerald" | "amber" | "red" | "slate";
}) {
  const accentClass = {
    blue: "bg-blue-50 text-blue-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
    slate: "bg-slate-100 text-slate-700",
  }[accent];

  return (
    <article className="card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-normal text-slate-950">{value}</p>
        </div>
        <div className={`rounded-md p-2 ${accentClass}`}>{icon}</div>
      </div>
      <p className="mt-4 text-sm text-slate-500">{helper}</p>
    </article>
  );
}
