import { Bell, FileText, ReceiptText, WalletCards } from "lucide-react";
import { Link } from "react-router-dom";
import { MetricCard } from "../../components/ui/MetricCard";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { useFinance } from "../../contexts/FinanceContext";
import { getPublicTransactions, summarizeTransactions } from "../../services/financeService";
import { formatCurrency, formatDate } from "../../utils/format";

export function ParentOverviewPage() {
  const { transactions, notifications, reports } = useFinance();
  const publicTransactions = getPublicTransactions(transactions);
  const summary = summarizeTransactions(publicTransactions);
  const latestReports = reports.slice(0, 2);

  return (
    <section>
      <SectionHeader
        title="Parent Dashboard"
        description="Ringkasan cepat laporan publik, transaksi terbaru, dan notifikasi untuk orang tua."
      />
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <MetricCard
          title="Pemasukan Publik"
          value={formatCurrency(summary.totalIncome)}
          helper="Periode tahun ajaran aktif"
          icon={<WalletCards size={20} />}
          accent="emerald"
        />
        <MetricCard
          title="Pengeluaran Publik"
          value={formatCurrency(summary.totalExpense)}
          helper="Transaksi sudah disetujui"
          icon={<ReceiptText size={20} />}
          accent="blue"
        />
        <MetricCard
          title="Laporan Terbaru"
          value={latestReports.length.toString()}
          helper="Siap diunduh orang tua"
          icon={<FileText size={20} />}
          accent="slate"
        />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="card p-5">
          <h2 className="text-lg font-semibold text-slate-950">Laporan Terbaru</h2>
          <div className="mt-4 grid gap-3">
            {latestReports.map((report) => (
              <Link key={report.id} to={`/reports/${report.id}`} className="rounded-lg border border-slate-200 p-4 hover:bg-slate-50">
                <p className="font-semibold text-slate-950">{report.title}</p>
                <p className="mt-1 text-sm text-slate-500">{formatDate(report.publishedAt)}</p>
              </Link>
            ))}
          </div>
        </article>
        <article className="card p-5">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-950">
            <Bell size={18} /> Notifikasi
          </h2>
          <div className="mt-4 grid gap-3">
            {notifications.map((notification) => (
                <Link key={notification.id} to={notification.linkUrl} className="rounded-lg border border-slate-200 p-4 hover:bg-slate-50">
                  <p className="font-semibold text-slate-950">{notification.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{notification.message}</p>
                </Link>
              ))}
          </div>
        </article>
      </div>
    </section>
  );
}
