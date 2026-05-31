import { Save } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { useFinance } from "../../contexts/FinanceContext";

export function SchoolSettingsPage() {
  const { school } = useFinance();

  return (
    <section>
      <SectionHeader
        title="School Settings"
        description="Profil sekolah, kontak, logo, dan tahun ajaran aktif untuk dashboard publik."
      />
      <form className="card mt-6 p-6">
        <div className="grid gap-5 lg:grid-cols-2">
          <label className="grid gap-2">
            <span className="label">Nama Sekolah</span>
            <input className="field" defaultValue={school?.name ?? ""} />
          </label>
          <label className="grid gap-2">
            <span className="label">Tahun Ajaran Aktif</span>
            <input className="field" defaultValue={school?.activeYear ?? ""} />
          </label>
          <label className="grid gap-2">
            <span className="label">Email</span>
            <input className="field" defaultValue={school?.email ?? ""} />
          </label>
          <label className="grid gap-2">
            <span className="label">Telepon</span>
            <input className="field" defaultValue={school?.phone ?? ""} />
          </label>
          <label className="grid gap-2 lg:col-span-2">
            <span className="label">Alamat</span>
            <textarea className="field min-h-24" defaultValue={school?.address ?? ""} />
          </label>
        </div>
        <Button className="mt-6" icon={<Save size={16} />} type="button">Update Settings</Button>
      </form>
    </section>
  );
}
