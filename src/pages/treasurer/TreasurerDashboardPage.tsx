import { CheckCircle2, Clock3, FilePenLine, PlusCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { TransactionTable } from "../../components/transactions/TransactionTable";
import { Button } from "../../components/ui/Button";
import { MetricCard } from "../../components/ui/MetricCard";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { useFinance } from "../../contexts/FinanceContext";
import { getTransactionsByStatus, summarizeTransactions } from "../../services/financeService";
import { formatCurrency } from "../../utils/format";

export function TreasurerDashboardPage() {
  const { transactions } = useFinance();
  const summary = summarizeTransactions(transactions);
  const recent = [...transactions].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  return (
    <section>
      <SectionHeader
        title="Treasurer Dashboard"
        description="Area kerja bendahara untuk membuat draft, upload evidence, dan mengajukan approval."
        action={<Button to="/treasurer/transactions/new" icon={<PlusCircle size={16} />}>Add Transaction</Button>}
      />
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Draft"
          value={getTransactionsByStatus("draft", transactions).length.toString()}
          helper="Bisa diedit dan dihapus"
          icon={<FilePenLine size={20} />}
          accent="slate"
        />
        <MetricCard
          title="Pending"
          value={getTransactionsByStatus("pending", transactions).length.toString()}
          helper="Menunggu review kepala sekolah"
          icon={<Clock3 size={20} />}
          accent="amber"
        />
        <MetricCard
          title="Approved"
          value={getTransactionsByStatus("approved", transactions).length.toString()}
          helper={formatCurrency(summary.totalIncome - summary.totalExpense)}
          icon={<CheckCircle2 size={20} />}
          accent="emerald"
        />
        <MetricCard
          title="Rejected"
          value={getTransactionsByStatus("rejected", transactions).length.toString()}
          helper="Perlu revisi sebelum submit ulang"
          icon={<XCircle size={20} />}
          accent="red"
        />
      </div>
      <div className="mt-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-950">Recent Transactions</h2>
          <Link className="text-sm font-semibold text-trust" to="/treasurer/transactions">Lihat semua</Link>
        </div>
        <TransactionTable transactions={recent} detailBasePath="/treasurer/transactions" />
      </div>
    </section>
  );
}
