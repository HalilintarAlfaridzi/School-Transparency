import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { useFinance } from "../../contexts/FinanceContext";

export function ContactPage() {
  const { school } = useFinance();

  return (
    <section className="page-container py-10">
      <SectionHeader
        eyebrow="Contact"
        title="Hubungi pihak sekolah"
        description="Gunakan kanal resmi untuk bertanya tentang laporan publik atau data yang perlu diperjelas."
      />
      <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="card p-6">
          <h2 className="text-lg font-semibold text-slate-950">Informasi Sekolah</h2>
          <div className="mt-5 grid gap-4 text-sm">
            <p className="flex gap-3 text-slate-700">
              <MapPin className="mt-0.5 shrink-0 text-trust" size={18} /> {school?.address || "-"}
            </p>
            <p className="flex gap-3 text-slate-700">
              <Phone className="mt-0.5 shrink-0 text-trust" size={18} /> {school?.phone || "-"}
            </p>
            <p className="flex gap-3 text-slate-700">
              <Mail className="mt-0.5 shrink-0 text-trust" size={18} /> {school?.email || "-"}
            </p>
          </div>
          <div className="mt-6 h-48 rounded-lg border border-slate-200 bg-slate-100 p-4 text-sm text-slate-500">
            Map placeholder - alamat sekolah dan jam layanan dapat dihubungkan ke layanan peta saat deployment.
          </div>
        </article>
        <form className="card p-6">
          <h2 className="text-lg font-semibold text-slate-950">Kirim Pesan</h2>
          <div className="mt-5 grid gap-4">
            <label className="grid gap-2">
              <span className="label">Nama</span>
              <input className="field" placeholder="Nama lengkap" />
            </label>
            <label className="grid gap-2">
              <span className="label">Email</span>
              <input className="field" type="email" placeholder="email@contoh.com" />
            </label>
            <label className="grid gap-2">
              <span className="label">Pesan</span>
              <textarea className="field min-h-36" placeholder="Tulis pertanyaan laporan atau transaksi" />
            </label>
            <Button className="w-full sm:w-auto" icon={<Send size={16} />} type="button">
              Kirim Pesan
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
