import { Badge } from "../../components/ui/Badge";
import { SectionHeader } from "../../components/ui/SectionHeader";

const permissions = [
  { role: "Parent", access: "Read published reports, update own profile, notification preferences" },
  { role: "Treasurer", access: "Create draft, upload evidence, submit approval, edit rejected" },
  { role: "Principal", access: "Review pending transactions, approve/reject, view analytics" },
  { role: "Admin", access: "Manage users, categories, settings, audit logs in school scope" },
];

export function RoleManagementPage() {
  return (
    <section>
      <SectionHeader
        title="Role Management"
        description="Permission matrix ringkas untuk role inti. Admin role tidak dibuat dari registrasi publik."
      />
      <div className="mt-6 grid gap-4">
        {permissions.map((item) => (
          <article key={item.role} className="card p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Badge tone="info">{item.role}</Badge>
              <p className="text-sm text-slate-600">{item.access}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
