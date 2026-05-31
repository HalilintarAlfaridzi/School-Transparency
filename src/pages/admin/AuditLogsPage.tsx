import { Badge } from "../../components/ui/Badge";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { useFinance } from "../../contexts/FinanceContext";
import { formatDate } from "../../utils/format";

export function AuditLogsPage() {
  const { auditLogs, profiles } = useFinance();

  return (
    <section>
      <SectionHeader
        title="Audit Logs"
        description="Semua aksi penting tercatat. Audit log tidak disediakan fitur hapus di UI."
      />
      <div className="card mt-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-3">Actor</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Target</th>
                <th className="px-4 py-3">New Values</th>
                <th className="px-4 py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id}>
                  <td className="table-cell font-semibold text-slate-950">
                    {profiles.find((profile) => profile.id === log.actorId)?.fullName}
                  </td>
                  <td className="table-cell"><Badge tone="info">{log.action}</Badge></td>
                  <td className="table-cell">{log.targetTable}</td>
                  <td className="table-cell">
                    <code className="rounded bg-slate-100 px-2 py-1 text-xs">
                      {JSON.stringify(log.newValues ?? {})}
                    </code>
                  </td>
                  <td className="table-cell">{formatDate(log.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
