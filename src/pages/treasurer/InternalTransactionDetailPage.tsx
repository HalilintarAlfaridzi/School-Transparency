import { ArrowLeft, Send } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { ApprovalTimeline } from "../../components/transactions/ApprovalTimeline";
import { EvidenceGallery } from "../../components/transactions/EvidenceGallery";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { statusLabels } from "../../constants/routes";
import { useFinance } from "../../contexts/FinanceContext";
import { getCategoryName, getEvidenceForTransaction } from "../../services/financeService";
import { formatCurrency, formatDate, statusTone } from "../../utils/format";

export function InternalTransactionDetailPage() {
  const { id } = useParams();
  const { transactions, categories, evidence } = useFinance();
  const transaction = transactions.find((item) => item.id === id);

  if (!transaction) {
    return <EmptyState title="Transaksi tidak ditemukan" description="Data transaksi internal tidak tersedia." />;
  }

  const canEdit = transaction.status === "draft" || transaction.status === "rejected";

  return (
    <section>
      <Link className="inline-flex items-center gap-2 text-sm font-semibold text-trust" to="/treasurer/transactions">
        <ArrowLeft size={16} /> Kembali
      </Link>
      <SectionHeader
        title={transaction.title}
        description="Detail internal bendahara untuk melihat status, evidence, dan catatan review."
        action={
          canEdit ? (
            <Button icon={<Send size={16} />} type="button">
              Submit Approval
            </Button>
          ) : undefined
        }
      />
      <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="card p-6">
          <Badge tone={statusTone(transaction.status)}>{statusLabels[transaction.status]}</Badge>
          <dl className="mt-6 grid gap-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Nominal</dt>
              <dd className="font-semibold text-slate-950">{formatCurrency(transaction.amount)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Kategori</dt>
              <dd className="font-semibold text-slate-950">{getCategoryName(transaction.categoryId, categories)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Tanggal</dt>
              <dd className="font-semibold text-slate-950">{formatDate(transaction.transactionDate)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Visibility</dt>
              <dd className="font-semibold text-slate-950">{transaction.visibility}</dd>
            </div>
          </dl>
          {transaction.reviewNote && (
            <p className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">{transaction.reviewNote}</p>
          )}
          {!canEdit && (
            <p className="mt-6 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
              Transaksi approved atau pending tidak dapat diedit langsung. Koreksi dilakukan lewat correction flow.
            </p>
          )}
        </article>
        <div className="grid gap-6">
          <article className="card p-6">
            <h2 className="text-lg font-semibold text-slate-950">Evidence</h2>
            <div className="mt-4">
              <EvidenceGallery items={getEvidenceForTransaction(transaction.id, evidence)} />
            </div>
          </article>
          <article className="card p-6">
            <h2 className="text-lg font-semibold text-slate-950">Approval Timeline</h2>
            <div className="mt-4">
              <ApprovalTimeline transaction={transaction} />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
