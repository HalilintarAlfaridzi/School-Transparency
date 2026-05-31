import { AlertTriangle, CheckCircle2, Clock3, TrendingUp } from "lucide-react";
import { CategoryBreakdownChart } from "../../components/charts/CategoryBreakdownChart";
import { Button } from "../../components/ui/Button";
import { MetricCard } from "../../components/ui/MetricCard";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { useFinance } from "../../contexts/FinanceContext";
import {
  categoryBreakdown,
  duplicateWarnings,
  getTransactionsByStatus,
  summarizeTransactions,
} from "../../services/financeService";
import { formatCurrency } from "../../utils/format";

export function PrincipalDashboardPage() {
  const { transactions } = useFinance();
  const approved = getTransactionsByStatus("approved", transactions);
  const summary = summarizeTransactions(approved);
  const pending = getTransactionsByStatus("pending", transactions);
  const warningCount = pending.reduce(
    (count, transaction) => count + duplicateWarnings(transaction, transactions).length,
    0,
  );

  return (
    <section>
      <SectionHeader
        title="Principal Dashboard"
        description="Ringkasan approval, pengeluaran besar, dan indikator risiko untuk membantu review cepat."
        action={<Button to="/principal/pending-approvals">Review Pending</Button>}
      />
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Pending Approval"
          value={pending.length.toString()}
          helper="Menunggu keputusan kepala sekolah"
          icon={<Clock3 size={20} />}
          accent="amber"
        />
        <MetricCard
          title="Approved"
          value={approved.length.toString()}
          helper="Masuk data resmi"
          icon={<CheckCircle2 size={20} />}
          accent="emerald"
        />
        <MetricCard
          title="Saldo Internal"
          value={formatCurrency(summary.balance)}
          helper="Approved income - expense"
          icon={<TrendingUp size={20} />}
          accent="blue"
        />
        <MetricCard
          title="Duplicate Warning"
          value={warningCount.toString()}
          helper="Indikasi nominal/tanggal/kategori mirip"
          icon={<AlertTriangle size={20} />}
          accent="red"
        />
      </div>
      <article className="card mt-6 p-5">
        <h2 className="text-lg font-semibold text-slate-950">Pengeluaran per Kategori</h2>
        <CategoryBreakdownChart data={categoryBreakdown(approved, "expense")} />
      </article>
    </section>
  );
}
