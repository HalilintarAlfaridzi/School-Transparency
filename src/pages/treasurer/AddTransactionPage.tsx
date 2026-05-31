import { Save, Send, UploadCloud } from "lucide-react";
import { FormEvent, useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { useFinance } from "../../contexts/FinanceContext";
import type { Visibility } from "../../types";

export function AddTransactionPage() {
  const { categories, createTransaction } = useFinance();
  const [type, setType] = useState<"income" | "expense">("expense");
  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionDate, setTransactionDate] = useState("2026-05-31");
  const [visibility, setVisibility] = useState<Visibility>("internal");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const filteredCategories = categories.filter((category) => category.type === type);

  async function saveTransaction(status: "draft" | "pending") {
    setResult(null);
    setError(null);
    setIsSubmitting(true);
    try {
      const selectedCategoryId = categoryId || filteredCategories[0]?.id;
      if (!selectedCategoryId) throw new Error("Kategori belum tersedia.");
      if (!title.trim()) throw new Error("Judul transaksi wajib diisi.");
      const numericAmount = Number(amount);
      if (!Number.isFinite(numericAmount) || numericAmount <= 0) throw new Error("Nominal harus lebih dari 0.");

      await createTransaction({
        type,
        categoryId: selectedCategoryId,
        title: title.trim(),
        description: description.trim(),
        amount: numericAmount,
        transactionDate,
        visibility,
        status,
      });

      setResult(status === "pending" ? "Transaksi berhasil diajukan ke approval." : "Transaksi berhasil disimpan sebagai draft.");
      setTitle("");
      setDescription("");
      setAmount("");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Gagal menyimpan transaksi.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void saveTransaction("draft");
  }

  return (
    <section>
      <SectionHeader
        title="Add Transaction"
        description="Form transaksi baru dengan status awal draft. Pengeluaran wajib evidence sebelum diajukan."
      />
      <form className="card mt-6 p-6" onSubmit={handleSubmit}>
        <div className="grid gap-5 lg:grid-cols-2">
          <label className="grid gap-2">
            <span className="label">Jenis Transaksi</span>
            <select className="field" value={type} onChange={(event) => setType(event.target.value as "income" | "expense")}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>
          <label className="grid gap-2">
            <span className="label">Kategori</span>
            <select className="field" value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
              {filteredCategories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="label">Nominal</span>
            <input className="field" inputMode="numeric" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="Contoh: 7500000" />
          </label>
          <label className="grid gap-2">
            <span className="label">Tanggal Transaksi</span>
            <input className="field" type="date" value={transactionDate} onChange={(event) => setTransactionDate(event.target.value)} />
          </label>
          <label className="grid gap-2 lg:col-span-2">
            <span className="label">Judul</span>
            <input className="field" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Contoh: Pembelian Proyektor Kelas" />
          </label>
          <label className="grid gap-2 lg:col-span-2">
            <span className="label">Deskripsi</span>
            <textarea className="field min-h-32" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Deskripsi umum yang aman dibaca reviewer" />
          </label>
          <label className="grid gap-2">
            <span className="label">Visibility</span>
            <select className="field" value={visibility} onChange={(event) => setVisibility(event.target.value as Visibility)}>
              <option value="internal">Internal</option>
              <option value="public">Public setelah approved</option>
            </select>
          </label>
          <div className="grid gap-2">
            <span className="label">Evidence</span>
            <div className="flex min-h-28 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-sm text-slate-600">
              <div>
                <UploadCloud className="mx-auto mb-2 text-trust" size={24} />
                Upload JPG, PNG, WebP, atau PDF. Maks 5 MB.
              </div>
            </div>
          </div>
        </div>
        {result && (
          <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            {result}
          </div>
        )}
        {error && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" icon={<Save size={16} />} type="submit" disabled={isSubmitting}>
            Save Draft
          </Button>
          <Button icon={<Send size={16} />} type="button" disabled={isSubmitting} onClick={() => void saveTransaction("pending")}>
            Submit Approval
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge tone="warning">Draft</Badge>
          <Badge tone="neutral">Evidence default internal</Badge>
        </div>
      </form>
    </section>
  );
}
