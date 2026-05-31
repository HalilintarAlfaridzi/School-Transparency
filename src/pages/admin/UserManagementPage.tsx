import { Badge } from "../../components/ui/Badge";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { roleLabels } from "../../constants/routes";
import { useFinance } from "../../contexts/FinanceContext";
import { formatDate } from "../../utils/format";

export function UserManagementPage() {
  const { profiles } = useFinance();

  return (
    <section>
      <SectionHeader
        title="User Management"
        description="Admin mengelola role dan status user dalam school scope. Perubahan role wajib masuk audit log."
      />
      <div className="card mt-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Last Login</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile) => (
                <tr key={profile.id}>
                  <td className="table-cell font-semibold text-slate-950">{profile.fullName}</td>
                  <td className="table-cell">{profile.email}</td>
                  <td className="table-cell"><Badge tone="info">{roleLabels[profile.role]}</Badge></td>
                  <td className="table-cell"><Badge tone={profile.status === "active" ? "success" : "danger"}>{profile.status}</Badge></td>
                  <td className="table-cell">{formatDate(profile.lastLogin)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
