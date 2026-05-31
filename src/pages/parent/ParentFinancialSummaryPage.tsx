import { Download } from "lucide-react";
import { CategoryBreakdownChart } from "../../components/charts/CategoryBreakdownChart";
import { IncomeExpenseChart } from "../../components/charts/IncomeExpenseChart";
import { Button } from "../../components/ui/Button";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { useFinance } from "../../contexts/FinanceContext";
import {
  categoryBreakdown,
  getPublicTransactions,
  monthlyTrend,
} from "../../services/financeService";

export function ParentFinancialSummaryPage() {
  const { transactions } = useFinance();
  const publicTransactions = getPublicTransactions(transactions);

  return (
    <section>
      <SectionHeader
        title="Financial Summary"
        description="Ringkasan visual agar orang tua bisa membaca tren dana sekolah tanpa membuka spreadsheet."
        action={<Button variant="secondary" icon={<Download size={16} />} type="button">Download Summary</Button>}
      />
      <div className="mt-6 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="card p-5">
          <h2 className="text-lg font-semibold text-slate-950">Income vs Expense</h2>
          <IncomeExpenseChart data={monthlyTrend(publicTransactions)} />
        </article>
        <article className="card p-5">
          <h2 className="text-lg font-semibold text-slate-950">Kategori Pengeluaran</h2>
          <CategoryBreakdownChart data={categoryBreakdown(publicTransactions, "expense")} />
        </article>
      </div>
      <article className="card mt-6 p-5">
        <h2 className="text-lg font-semibold text-slate-950">Catatan Pembacaan</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Data ini hanya memuat transaksi yang sudah disetujui dan dipublikasikan. Bukti internal,
          data gaji per individu, dan informasi rekening tidak ditampilkan di area publik.
        </p>
      </article>
    </section>
  );
}
