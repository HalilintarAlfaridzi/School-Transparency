import { Download, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { useFinance } from "../../contexts/FinanceContext";
import { formatCurrency, formatDate } from "../../utils/format";

export function ReportsPage() {
  const { reports, error } = useFinance();

  return (
    <section className="page-container py-10">
      <SectionHeader
        eyebrow="Financial Reports"
        title="Laporan keuangan berkala"
        description="Daftar laporan yang sudah dipublikasikan untuk orang tua dan masyarakat."
      />
      {error ? (
        <div className="mt-8">
          <EmptyState title="Gagal memuat laporan" description={error} />
        </div>
      ) : reports.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="Belum ada laporan" description="Belum ada laporan yang dipublikasikan untuk periode ini." />
        </div>
      ) : (
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {reports.map((report) => (
          <article key={report.id} className="card p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="rounded-md bg-blue-50 p-2 text-trust">
                <FileText size={20} />
              </div>
              <Badge tone="success">Published</Badge>
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-950">{report.title}</h2>
            <p className="mt-1 text-sm text-slate-500">{report.period}</p>
            <div className="mt-5 grid gap-2 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Pemasukan</span>
                <span className="font-semibold text-slate-950">{formatCurrency(report.totalIncome)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Pengeluaran</span>
                <span className="font-semibold text-slate-950">{formatCurrency(report.totalExpense)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Dipublikasikan</span>
                <span className="font-semibold text-slate-950">{formatDate(report.publishedAt)}</span>
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <Button className="flex-1" variant="secondary" to={`/reports/${report.id}`}>
                Detail
              </Button>
              <Button className="flex-1" icon={<Download size={16} />} type="button">
                {report.fileType}
              </Button>
            </div>
          </article>
        ))}
      </div>
      )}
      <p className="mt-6 text-sm text-slate-500">
        Untuk detail transaksi publik, buka juga <Link className="font-semibold text-trust" to="/transparency">dashboard transparansi</Link>.
      </p>
    </section>
  );
}
