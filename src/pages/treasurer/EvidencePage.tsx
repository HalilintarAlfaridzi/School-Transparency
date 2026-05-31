import { EvidenceGallery } from "../../components/transactions/EvidenceGallery";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { useFinance } from "../../contexts/FinanceContext";

export function EvidencePage() {
  const { evidence } = useFinance();

  return (
    <section>
      <SectionHeader
        title="Upload Evidence"
        description="Metadata bukti transaksi. File approved tidak boleh dihapus sembarangan dan perubahan visibility dicatat audit log."
      />
      <div className="mt-6">
        <EvidenceGallery items={evidence} />
      </div>
    </section>
  );
}
