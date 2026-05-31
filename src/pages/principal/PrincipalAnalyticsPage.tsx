import { CategoryBreakdownChart } from "../../components/charts/CategoryBreakdownChart";
import { IncomeExpenseChart } from "../../components/charts/IncomeExpenseChart";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { useFinance } from "../../contexts/FinanceContext";
import { categoryBreakdown, monthlyTrend } from "../../services/financeService";

export function PrincipalAnalyticsPage() {
  const { transactions } = useFinance();
  const approved = transactions.filter((transaction) => transaction.status === "approved");

  return (
    <section>
      <SectionHeader
        title="Financial Analytics"
        description="Analisis internal untuk kepala sekolah, termasuk transaksi yang tidak semuanya tampil publik."
      />
      <div className="mt-6 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="card p-5">
          <h2 className="text-lg font-semibold text-slate-950">Balance Movement</h2>
          <IncomeExpenseChart data={monthlyTrend(approved)} />
        </article>
        <article className="card p-5">
          <h2 className="text-lg font-semibold text-slate-950">Top Expense Categories</h2>
          <CategoryBreakdownChart data={categoryBreakdown(approved, "expense")} />
        </article>
      </div>
    </section>
  );
}
