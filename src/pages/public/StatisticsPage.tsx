import { BarChart3, BookOpen, GraduationCap, Users } from "lucide-react";
import { IncomeExpenseChart } from "../../components/charts/IncomeExpenseChart";
import { MetricCard } from "../../components/ui/MetricCard";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { useFinance } from "../../contexts/FinanceContext";
import { getPublicTransactions, monthlyTrend, summarizeTransactions } from "../../services/financeService";
import { formatCurrency } from "../../utils/format";

export function StatisticsPage() {
  const { school, transactions } = useFinance();
  const publicTransactions = getPublicTransactions(transactions);
  const summary = summarizeTransactions(publicTransactions);

  return (
    <section className="page-container py-10">
      <SectionHeader
        eyebrow="School Statistics"
        title="Konteks sekolah dan dana yang dipublikasikan"
        description="Statistik ini membantu orang tua membaca angka keuangan bersama konteks ukuran sekolah."
      />
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Jumlah Siswa"
          value={(school?.studentCount ?? 0).toLocaleString("id-ID")}
          helper="Data profil sekolah"
          icon={<Users size={20} />}
          accent="blue"
        />
        <MetricCard
          title="Jumlah Kelas"
          value={(school?.classCount ?? 0).toString()}
          helper="Rombongan belajar aktif"
          icon={<BookOpen size={20} />}
          accent="slate"
        />
        <MetricCard
          title="Program"
          value={(school?.programCount ?? 0).toString()}
          helper="Kegiatan akademik dan nonakademik"
          icon={<GraduationCap size={20} />}
          accent="emerald"
        />
        <MetricCard
          title="Dana Dikelola"
          value={formatCurrency(summary.totalIncome)}
          helper="Total pemasukan publik"
          icon={<BarChart3 size={20} />}
          accent="amber"
        />
      </div>
      <article className="card mt-8 p-5">
        <h2 className="text-lg font-semibold text-slate-950">Perbandingan Bulanan</h2>
        <IncomeExpenseChart data={monthlyTrend(publicTransactions)} />
      </article>
    </section>
  );
}
