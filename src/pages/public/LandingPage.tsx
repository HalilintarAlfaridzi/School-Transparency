import {
  ArrowRight,
  BarChart3,
  ClipboardCheck,
  Eye,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";
import { CategoryBreakdownChart } from "../../components/charts/CategoryBreakdownChart";
import { IncomeExpenseChart } from "../../components/charts/IncomeExpenseChart";
import { MetricCard } from "../../components/ui/MetricCard";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { useFinance } from "../../contexts/FinanceContext";
import {
  categoryBreakdown,
  financialHealthScore,
  getPublicTransactions,
  monthlyTrend,
  summarizeTransactions,
} from "../../services/financeService";
import { formatCurrency } from "../../utils/format";

const features = [
  {
    icon: ClipboardCheck,
    title: "Approval Workflow",
    description: "Bendahara membuat transaksi, kepala sekolah mereview, lalu transaksi dipublikasikan setelah disetujui.",
  },
  {
    icon: FileCheck2,
    title: "Evidence-Based",
    description: "Bukti transaksi tersimpan sebagai metadata file dan dapat dipilih apakah internal atau publik.",
  },
  {
    icon: ShieldCheck,
    title: "Role-Based Access",
    description: "Guest, parent, bendahara, kepala sekolah, dan admin memiliki akses sesuai tanggung jawabnya.",
  },
];

export function LandingPage() {
  const { school, transactions, isLoading, error } = useFinance();
  const publicTransactions = getPublicTransactions(transactions);
  const summary = summarizeTransactions(publicTransactions);
  const trend = monthlyTrend(publicTransactions);
  const expenseBreakdown = categoryBreakdown(publicTransactions, "expense");
  const health = financialHealthScore(transactions);

  if (error) {
    return (
      <section className="page-container py-10">
        <EmptyState title="Gagal memuat data" description={error} />
      </section>
    );
  }

  return (
    <>
      <section className="border-b border-slate-200 bg-white">
        <div className="page-container grid min-h-[calc(100vh-4rem)] items-center gap-10 py-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="inline-flex rounded-md bg-blue-50 px-3 py-1 text-sm font-semibold text-trust">
              Civic-tech untuk akuntabilitas sekolah
            </p>
            <h1 className="mt-6 text-4xl font-bold tracking-normal text-slate-950 sm:text-5xl">
              Transparansi keuangan {school?.name ?? "sekolah"}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
              Platform ini membuat pemasukan, pengeluaran, evidence, approval, dan audit trail sekolah lebih mudah
              dibaca oleh orang tua tanpa membuka data sensitif secara berlebihan.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button to="/transparency" icon={<Eye size={17} />}>
                Lihat Dashboard Publik
              </Button>
              <Button to="/login" variant="secondary" icon={<ArrowRight size={17} />}>
                Masuk Dashboard Role
              </Button>
            </div>
          </div>
          <div className="card overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-950">Transparency Snapshot</p>
                  <p className="text-xs text-slate-500">{isLoading ? "Memuat..." : school?.activeYear ?? "-"}</p>
                </div>
                <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                  Health {health}/100
                </span>
              </div>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-3">
              <MetricCard
                title="Pemasukan"
                value={formatCurrency(summary.totalIncome)}
                helper="Approved dan public"
                icon={<BarChart3 size={20} />}
                accent="emerald"
              />
              <MetricCard
                title="Pengeluaran"
                value={formatCurrency(summary.totalExpense)}
                helper="Kategori publik"
                icon={<BarChart3 size={20} />}
                accent="blue"
              />
              <MetricCard
                title="Saldo"
                value={formatCurrency(summary.balance)}
                helper={`${summary.transactionCount} transaksi publik`}
                icon={<ShieldCheck size={20} />}
                accent="slate"
              />
            </div>
            <div className="grid gap-4 border-t border-slate-200 p-5 lg:grid-cols-2">
              <IncomeExpenseChart data={trend} />
              <CategoryBreakdownChart data={expenseBreakdown} />
            </div>
          </div>
        </div>
      </section>

      <section className="page-container py-14">
        <SectionHeader
          eyebrow="Masalah dan solusi"
          title="Workflow transparansi, bukan hanya angka masuk dan keluar"
          description="Setiap transaksi melewati pencatatan, bukti, review, audit log, dan publikasi sehingga sekolah punya jejak pertanggungjawaban yang jelas."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="card p-5">
                <div className="mb-4 inline-flex rounded-md bg-blue-50 p-2 text-trust">
                  <Icon size={22} />
                </div>
                <h2 className="text-lg font-semibold text-slate-950">{feature.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
