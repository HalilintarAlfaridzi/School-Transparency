import { AlertTriangle, Check, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { EvidenceGallery } from "../../components/transactions/EvidenceGallery";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { useAuth } from "../../contexts/AuthContext";
import { useFinance } from "../../contexts/FinanceContext";
import { getCategoryName, duplicateWarnings, getEvidenceForTransaction, getTransactionsByStatus } from "../../services/financeService";
import { formatCurrency, formatDate } from "../../utils/format";

export function PendingApprovalsPage() {
  const { user } = useAuth();
  const { transactions, categories, evidence, approveTransaction, rejectTransaction } = useFinance();
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const pending = getTransactionsByStatus("pending", transactions);

  async function handleApprove(transactionId: string) {
    try {
      const success = await approveTransaction({
        transactionId,
        reviewerId: user?.id ?? "",
        note: "Bukti valid dan nominal sesuai.",
      });

      setFeedback(
        success
          ? "Transaksi berhasil disetujui dan masuk approval history."
          : "Transaksi tidak bisa direview karena statusnya sudah berubah.",
      );
      setRejectingId(null);
      setRejectNote("");
    } catch (reviewError) {
      setFeedback(reviewError instanceof Error ? reviewError.message : "Gagal approve transaksi.");
    }
  }

  async function handleReject(transactionId: string) {
    if (!rejectNote.trim()) {
      setFeedback("Alasan rejection wajib diisi sebelum transaksi ditolak.");
      return;
    }

    try {
      const success = await rejectTransaction({
        transactionId,
        reviewerId: user?.id ?? "",
        note: rejectNote.trim(),
      });

      setFeedback(
        success
          ? "Transaksi berhasil ditolak dan bendahara bisa memperbaiki data."
          : "Transaksi tidak bisa direview karena statusnya sudah berubah.",
      );
      setRejectingId(null);
      setRejectNote("");
    } catch (reviewError) {
      setFeedback(reviewError instanceof Error ? reviewError.message : "Gagal reject transaksi.");
    }
  }

  return (
    <section>
      <SectionHeader
        title="Pending Approvals"
        description="Review transaksi pending, cek evidence, warning duplikat, lalu approve atau reject dengan alasan."
      />
      {feedback && (
        <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm font-medium text-blue-800">
          {feedback}
        </div>
      )}
      <div className="mt-6 grid gap-4">
        {pending.map((transaction) => {
          const warnings = duplicateWarnings(transaction, transactions);
          return (
            <article key={transaction.id} className="card p-5">
              <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="warning">Pending</Badge>
                    {warnings.length > 0 && (
                      <Badge tone="danger">
                        <AlertTriangle size={13} className="mr-1" /> Duplicate warning
                      </Badge>
                    )}
                  </div>
                  <h2 className="mt-3 text-xl font-bold text-slate-950">{transaction.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{transaction.description}</p>
                  <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
                    <div>
                      <dt className="text-slate-500">Nominal</dt>
                      <dd className="font-semibold text-slate-950">{formatCurrency(transaction.amount)}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Kategori</dt>
                      <dd className="font-semibold text-slate-950">{getCategoryName(transaction.categoryId, categories)}</dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Tanggal</dt>
                      <dd className="font-semibold text-slate-950">{formatDate(transaction.transactionDate)}</dd>
                    </div>
                  </dl>
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <Button icon={<Check size={16} />} type="button" onClick={() => handleApprove(transaction.id)}>
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      icon={<X size={16} />}
                      type="button"
                      onClick={() => {
                        setRejectingId(transaction.id);
                        setFeedback(null);
                      }}
                    >
                      Reject
                    </Button>
                    <Button variant="secondary" to={`/principal/approvals/${transaction.id}`}>Detail</Button>
                  </div>
                  {rejectingId === transaction.id && (
                    <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4">
                      <label className="grid gap-2">
                        <span className="label text-red-800">Alasan Rejection</span>
                        <textarea
                          className="field min-h-24"
                          value={rejectNote}
                          onChange={(event) => setRejectNote(event.target.value)}
                          placeholder="Contoh: Bukti transaksi kurang jelas dan perlu rincian vendor."
                        />
                      </label>
                      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                        <Button variant="danger" type="button" onClick={() => handleReject(transaction.id)}>
                          Confirm Reject
                        </Button>
                        <Button
                          variant="secondary"
                          type="button"
                          onClick={() => {
                            setRejectingId(null);
                            setRejectNote("");
                          }}
                        >
                          Batal
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                <EvidenceGallery items={getEvidenceForTransaction(transaction.id, evidence)} />
              </div>
            </article>
          );
        })}
      </div>
      {pending.length === 0 && (
        <p className="mt-6 text-sm text-slate-500">
          Tidak ada approval pending. Buka <Link className="font-semibold text-trust" to="/principal/approval-history">approval history</Link>.
        </p>
      )}
    </section>
  );
}
