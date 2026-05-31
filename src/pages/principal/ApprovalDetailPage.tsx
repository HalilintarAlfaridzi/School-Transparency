import { Check, X } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { ApprovalTimeline } from "../../components/transactions/ApprovalTimeline";
import { EvidenceGallery } from "../../components/transactions/EvidenceGallery";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { statusLabels } from "../../constants/routes";
import { useAuth } from "../../contexts/AuthContext";
import { useFinance } from "../../contexts/FinanceContext";
import { getCategoryName, getEvidenceForTransaction } from "../../services/financeService";
import { formatCurrency, formatDate, statusTone } from "../../utils/format";

export function ApprovalDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { transactions, categories, evidence, approveTransaction, rejectTransaction } = useFinance();
  const [note, setNote] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const transaction = transactions.find((item) => item.id === id);

  if (!transaction) {
    return <EmptyState title="Transaksi tidak ditemukan" description="Data approval tidak tersedia untuk ID tersebut." />;
  }

  const canReview = transaction.status === "pending";
  const transactionId = transaction.id;

  async function handleApprove() {
    try {
      const success = await approveTransaction({
        transactionId,
        reviewerId: user?.id ?? "",
        note: note.trim() || "Bukti valid dan nominal sesuai.",
      });

      setFeedback(
        success
          ? "Transaksi berhasil disetujui."
          : "Transaksi tidak bisa direview karena statusnya sudah berubah.",
      );
    } catch (reviewError) {
      setFeedback(reviewError instanceof Error ? reviewError.message : "Gagal approve transaksi.");
    }
  }

  async function handleReject() {
    if (!note.trim()) {
      setFeedback("Catatan review wajib diisi untuk menolak transaksi.");
      return;
    }

    try {
      const success = await rejectTransaction({
        transactionId,
        reviewerId: user?.id ?? "",
        note: note.trim(),
      });

      setFeedback(
        success
          ? "Transaksi berhasil ditolak."
          : "Transaksi tidak bisa direview karena statusnya sudah berubah.",
      );
    } catch (reviewError) {
      setFeedback(reviewError instanceof Error ? reviewError.message : "Gagal reject transaksi.");
    }
  }

  return (
    <section>
      <SectionHeader
        title={transaction.title}
        description="Detail review kepala sekolah: nominal, kategori, evidence, dan timeline approval."
      />
      {feedback && (
        <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm font-medium text-blue-800">
          {feedback}
        </div>
      )}
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
          </dl>
          <label className="mt-6 grid gap-2">
            <span className="label">Catatan Review</span>
            <textarea
              className="field min-h-28"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Alasan approval atau rejection"
              disabled={!canReview}
            />
          </label>
          {!canReview && (
            <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
              Transaksi ini sudah direview, sehingga tombol approval dinonaktifkan.
            </p>
          )}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button icon={<Check size={16} />} type="button" onClick={handleApprove} disabled={!canReview}>
              Approve
            </Button>
            <Button variant="danger" icon={<X size={16} />} type="button" onClick={handleReject} disabled={!canReview}>
              Reject
            </Button>
          </div>
        </article>
        <div className="grid gap-6">
          <article className="card p-6">
            <h2 className="text-lg font-semibold text-slate-950">Evidence</h2>
            <div className="mt-4">
              <EvidenceGallery items={getEvidenceForTransaction(transaction.id, evidence)} />
            </div>
          </article>
          <article className="card p-6">
            <h2 className="text-lg font-semibold text-slate-950">Timeline</h2>
            <div className="mt-4">
              <ApprovalTimeline transaction={transaction} />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
