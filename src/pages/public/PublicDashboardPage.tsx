import { Download, Filter, Landmark, ReceiptText, WalletCards } from "lucide-react";
import { useMemo, useState } from "react";
import { CategoryBreakdownChart } from "../../components/charts/CategoryBreakdownChart";
import { IncomeExpenseChart } from "../../components/charts/IncomeExpenseChart";
import { TransactionTable } from "../../components/transactions/TransactionTable";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { MetricCard } from "../../components/ui/MetricCard";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { useFinance } from "../../contexts/FinanceContext";
import {
  categoryBreakdown,
  financialHealthScore,
  getPublicTransactions,
  monthlyTrend,
  summarizeTransactions,
} from "../../services/financeService";
import { formatCurrency } from "../../utils/format";

export function PublicDashboardPage() {
  const { transactions, error } = useFinance();
  const [query, setQuery] = useState("");
  const publicTransactions = getPublicTransactions(transactions);
  const filtered = useMemo(
    () =>
      publicTransactions.filter((transaction) =>
        `${transaction.title} ${transaction.description}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [publicTransactions, query],
  );
  const summary = summarizeTransactions(filtered);
  const trend = monthlyTrend(filtered);
  const expenseBreakdown = categoryBreakdown(filtered, "expense");
  const health = financialHealthScore(transactions);

  return (
    <section className="page-container py-10">
      <SectionHeader
        eyebrow="Public Financial Dashboard"
        title="Ringkasan dana sekolah yang sudah disetujui"
        description="Data publik hanya mengambil transaksi berstatus approved, visibility public, dan is_public true."
        action={
          <Button variant="secondary" icon={<Download size={16} />} type="button">
            Download Laporan
          </Button>
        }
      />
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total Pemasukan"
          value={formatCurrency(summary.totalIncome)}
          helper="Approved dan public"
          icon={<Landmark size={20} />}
          accent="emerald"
        />
        <MetricCard
          title="Total Pengeluaran"
          value={formatCurrency(summary.totalExpense)}
          helper="Approved dan public"
          icon={<ReceiptText size={20} />}
          accent="blue"
        />
        <MetricCard
          title="Saldo Berjalan"
          value={formatCurrency(summary.balance)}
          helper="Pemasukan dikurangi pengeluaran"
          icon={<WalletCards size={20} />}
          accent="slate"
        />
        <MetricCard
          title="Financial Health"
          value={`${health}/100`}
          helper="Indikator sederhana, bukan audit resmi"
          icon={<Filter size={20} />}
          accent="amber"
        />
      </div>
      <div className="mt-8 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="card p-5">
          <h2 className="text-lg font-semibold text-slate-950">Tren Bulanan</h2>
          <IncomeExpenseChart data={trend} />
        </article>
        <article className="card p-5">
          <h2 className="text-lg font-semibold text-slate-950">Breakdown Pengeluaran</h2>
          <CategoryBreakdownChart data={expenseBreakdown} />
        </article>
      </div>
      <div className="mt-8">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold text-slate-950">Transaksi Publik Terbaru</h2>
          <input
            className="field sm:max-w-xs"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari transaksi"
            aria-label="Cari transaksi publik"
          />
        </div>
        {error ? (
          <EmptyState title="Gagal memuat dashboard" description={error} />
        ) : filtered.length > 0 ? (
          <TransactionTable transactions={filtered} publicOnly />
        ) : (
          <EmptyState
            title="Belum ada transaksi yang dipublikasikan"
            description="Transaksi akan tampil setelah disetujui kepala sekolah dan ditandai public."
          />
        )}
      </div>
    </section>
  );
}
