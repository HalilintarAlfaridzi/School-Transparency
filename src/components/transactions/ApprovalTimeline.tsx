import { CheckCircle2, Clock3, FileUp, Send, XCircle } from "lucide-react";
import type { Transaction } from "../../types";
import { formatDate } from "../../utils/format";

export function ApprovalTimeline({ transaction }: { transaction: Transaction }) {
  const items = [
    {
      label: "Transaksi dibuat",
      description: "Bendahara membuat draft transaksi.",
      date: transaction.createdAt,
      icon: FileUp,
      active: true,
    },
    {
      label: "Diajukan untuk approval",
      description: "Transaksi masuk daftar review kepala sekolah.",
      date: transaction.updatedAt,
      icon: Send,
      active: transaction.status !== "draft",
    },
    {
      label: transaction.status === "rejected" ? "Ditolak" : "Direview",
      description:
        transaction.status === "rejected"
          ? transaction.reviewNote ?? "Transaksi perlu diperbaiki."
          : "Kepala sekolah mengecek nominal, kategori, dan bukti.",
      date: transaction.rejectedAt ?? transaction.approvedAt ?? transaction.updatedAt,
      icon: transaction.status === "rejected" ? XCircle : Clock3,
      active: transaction.status === "pending" || transaction.status === "rejected" || transaction.status === "approved",
    },
    {
      label: "Dipublikasikan",
      description: "Transaksi yang approved dan public tampil di dashboard transparansi.",
      date: transaction.publishedAt ?? transaction.approvedAt ?? transaction.updatedAt,
      icon: CheckCircle2,
      active: transaction.status === "approved" && transaction.isPublic,
    },
  ];

  return (
    <ol className="space-y-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <li key={item.label} className="flex gap-3">
            <div
              className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                item.active ? "bg-blue-50 text-trust" : "bg-slate-100 text-slate-400"
              }`}
            >
              <Icon size={17} />
            </div>
            <div>
              <p className="font-semibold text-slate-950">{item.label}</p>
              <p className="mt-1 text-sm text-slate-600">{item.description}</p>
              <p className="mt-1 text-xs text-slate-500">{formatDate(item.date)}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
