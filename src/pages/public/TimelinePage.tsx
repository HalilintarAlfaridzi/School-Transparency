import { CheckCircle2, FileText, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "../../components/ui/Badge";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { useFinance } from "../../contexts/FinanceContext";
import { getPublicTransactions } from "../../services/financeService";
import { formatCurrency, formatDate } from "../../utils/format";

export function TimelinePage() {
  const { reports, transactions } = useFinance();
  const events = [
    ...getPublicTransactions(transactions).map((transaction) => ({
      id: transaction.id,
      type: "transaction" as const,
      title: transaction.title,
      date: transaction.publishedAt ?? transaction.approvedAt ?? transaction.transactionDate,
      description: `${formatCurrency(transaction.amount)} dipublikasikan dalam kategori transparansi.`,
      href: `/reports/${transaction.id}`,
    })),
    ...reports.map((report) => ({
      id: report.id,
      type: "report" as const,
      title: report.title,
      date: report.publishedAt,
      description: `Laporan ${report.period} diterbitkan untuk publik.`,
      href: `/reports/${report.id}`,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <section className="page-container py-10">
      <SectionHeader
        eyebrow="Transparency Timeline"
        title="Riwayat publikasi dan approval"
        description="Timeline memperlihatkan bahwa transparansi adalah proses yang tercatat, bukan hanya hasil akhir."
      />
      <div className="mt-8 grid gap-4">
        {events.map((event) => {
          const Icon = event.type === "report" ? FileText : CheckCircle2;
          return (
            <Link key={`${event.type}-${event.id}`} to={event.href} className="card p-5 hover:border-blue-200">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-50 text-trust">
                  <Icon size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold text-slate-950">{event.title}</h2>
                    <Badge tone={event.type === "report" ? "info" : "success"}>
                      {event.type === "report" ? "Report" : "Published"}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{event.description}</p>
                  <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500">
                    <Send size={13} /> {formatDate(event.date)}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
