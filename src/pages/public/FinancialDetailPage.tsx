import { ArrowLeft, Share2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { ApprovalTimeline } from "../../components/transactions/ApprovalTimeline";
import { EvidenceGallery } from "../../components/transactions/EvidenceGallery";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { useFinance } from "../../contexts/FinanceContext";
import {
  getCategoryName,
  getEvidenceForTransaction,
  getPublicTransactions,
} from "../../services/financeService";
import { formatCurrency, formatDate, statusTone } from "../../utils/format";
import { statusLabels } from "../../constants/routes";

export function FinancialDetailPage() {
  const { id } = useParams();
  const { reports, transactions, categories, evidence } = useFinance();
  const publicTransactions = getPublicTransactions(transactions);
  const publicTransaction = publicTransactions.find((transaction) => transaction.id === id);
  const report = reports.find((item) => item.id === id);

  if (report && !publicTransaction) {
    const relatedTransactions = publicTransactions.slice(0, 3);
    return (
      <section className="page-container py-10">
        <Link className="inline-flex items-center gap-2 text-sm font-semibold text-trust" to="/reports">
          <ArrowLeft size={16} /> Kembali ke laporan
        </Link>
        <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="card p-6">
            <Badge tone="success">Published</Badge>
            <h1 className="mt-4 text-2xl font-bold text-slate-950">{report.title}</h1>
            <p className="mt-2 text-slate-600">{report.period} - {report.schoolYear}</p>
            <dl className="mt-6 grid gap-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Total pemasukan</dt>
                <dd className="font-semibold text-slate-950">{formatCurrency(report.totalIncome)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Total pengeluaran</dt>
                <dd className="font-semibold text-slate-950">{formatCurrency(report.totalExpense)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Dipublikasikan</dt>
                <dd className="font-semibold text-slate-950">{formatDate(report.publishedAt)}</dd>
              </div>
            </dl>
            <Button className="mt-6 w-full" icon={<Share2 size={16} />} type="button">
              Share Link
            </Button>
          </article>
          <article className="card p-6">
            <h2 className="text-lg font-semibold text-slate-950">Transaksi Terkait</h2>
            <div className="mt-4 grid gap-3">
              {relatedTransactions.map((transaction) => (
                <Link
                  key={transaction.id}
                  to={`/reports/${transaction.id}`}
                  className="rounded-lg border border-slate-200 p-4 hover:bg-slate-50"
                >
                  <p className="font-semibold text-slate-950">{transaction.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{formatCurrency(transaction.amount)}</p>
                </Link>
              ))}
            </div>
          </article>
        </div>
      </section>
    );
  }

  if (!publicTransaction) {
    const internalMatch = transactions.find((transaction) => transaction.id === id);
    return (
      <section className="page-container py-10">
        <EmptyState
          title={internalMatch ? "Transaksi tidak dipublikasikan" : "Transaksi tidak ditemukan"}
          description="Detail hanya tersedia untuk transaksi yang approved, public, dan aman ditampilkan."
          action={
            <Button to="/transparency" variant="secondary">
              Kembali ke Dashboard
            </Button>
          }
        />
      </section>
    );
  }

  const proof = getEvidenceForTransaction(publicTransaction.id, evidence, true);

  return (
    <section className="page-container py-10">
      <Link className="inline-flex items-center gap-2 text-sm font-semibold text-trust" to="/transparency">
        <ArrowLeft size={16} /> Kembali ke dashboard
      </Link>
      <div className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <article className="card p-6">
          <Badge tone={statusTone(publicTransaction.status)}>{statusLabels[publicTransaction.status]}</Badge>
          <h1 className="mt-4 text-2xl font-bold text-slate-950">{publicTransaction.title}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">{publicTransaction.description}</p>
          <dl className="mt-6 grid gap-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Nominal</dt>
              <dd className="font-semibold text-slate-950">{formatCurrency(publicTransaction.amount)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Kategori</dt>
              <dd className="font-semibold text-slate-950">{getCategoryName(publicTransaction.categoryId, categories)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Tanggal transaksi</dt>
              <dd className="font-semibold text-slate-950">{formatDate(publicTransaction.transactionDate)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Published</dt>
              <dd className="font-semibold text-slate-950">
                {publicTransaction.publishedAt ? formatDate(publicTransaction.publishedAt) : "-"}
              </dd>
            </div>
          </dl>
        </article>
        <div className="grid gap-6">
          <article className="card p-6">
            <h2 className="text-lg font-semibold text-slate-950">Evidence Publik</h2>
            <div className="mt-4">
              <EvidenceGallery items={proof} />
            </div>
          </article>
          <article className="card p-6">
            <h2 className="text-lg font-semibold text-slate-950">Timeline Transparansi</h2>
            <div className="mt-4">
              <ApprovalTimeline transaction={publicTransaction} />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
