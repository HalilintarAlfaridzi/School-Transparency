import { Badge } from "../../components/ui/Badge";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { useFinance } from "../../contexts/FinanceContext";

export function CategoryManagementPage() {
  const { categories } = useFinance();

  return (
    <section>
      <SectionHeader
        title="Category Management"
        description="Kategori dibuat manusiawi agar orang tua mudah memahami penggunaan dana."
      />
      <div className="card mt-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Deskripsi</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="table-cell font-semibold text-slate-950">{category.name}</td>
                  <td className="table-cell">
                    <Badge tone={category.type === "income" ? "success" : "info"}>{category.type}</Badge>
                  </td>
                  <td className="table-cell">{category.description}</td>
                  <td className="table-cell"><Badge tone="success">active</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
