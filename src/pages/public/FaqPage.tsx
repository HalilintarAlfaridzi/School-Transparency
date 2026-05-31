import { useMemo, useState } from "react";
import { SectionHeader } from "../../components/ui/SectionHeader";

const faqs = [
  {
    question: "Apakah semua transaksi sekolah tampil publik?",
    answer:
      "Tidak. Dashboard publik hanya menampilkan transaksi yang sudah approved, ditandai public, dan tidak mengandung data sensitif.",
  },
  {
    question: "Apakah bukti transaksi selalu bisa dibuka?",
    answer:
      "Evidence default bersifat internal. Evidence publik hanya tampil jika aman dipublikasikan, misalnya nota tanpa data pribadi.",
  },
  {
    question: "Siapa yang menyetujui transaksi?",
    answer:
      "Bendahara mengajukan transaksi, lalu kepala sekolah melakukan review dengan catatan approval atau rejection.",
  },
  {
    question: "Apakah financial health score adalah audit resmi?",
    answer:
      "Bukan. Skor tersebut adalah indikator sederhana berbasis saldo, tren, dan status review untuk membantu pembacaan dashboard.",
  },
];

export function FaqPage() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => faqs.filter((item) => item.question.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  return (
    <section className="page-container py-10">
      <SectionHeader
        eyebrow="FAQ"
        title="Pertanyaan umum soal transparansi dana"
        description="Jawaban singkat untuk membantu orang tua memahami batasan data publik dan workflow approval."
      />
      <input
        className="field mt-8 max-w-lg"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Cari pertanyaan"
        aria-label="Cari FAQ"
      />
      <div className="mt-6 grid gap-3">
        {filtered.map((item) => (
          <details key={item.question} className="card p-5">
            <summary className="cursor-pointer font-semibold text-slate-950">{item.question}</summary>
            <p className="mt-3 text-sm leading-6 text-slate-600">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
