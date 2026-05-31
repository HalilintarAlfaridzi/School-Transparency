import { Badge } from "../../components/ui/Badge";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { useFinance } from "../../contexts/FinanceContext";
import { formatDate } from "../../utils/format";

export function ApprovalHistoryPage() {
  const { approvals, transactions, profiles } = useFinance();

  return (
    <section>
      <SectionHeader
        title="Approval History"
        description="Riwayat keputusan kepala sekolah dengan catatan review dan timestamp."
      />
      <div className="card mt-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="table-head">
              <tr>
                <th className="px-4 py-3">Transaksi</th>
                <th className="px-4 py-3">Reviewer</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Catatan</th>
                <th className="px-4 py-3">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {approvals.map((approval) => (
                <tr key={approval.id}>
                  <td className="table-cell font-semibold text-slate-950">
                    {transactions.find((transaction) => transaction.id === approval.transactionId)?.title}
                  </td>
                  <td className="table-cell">
                    {profiles.find((profile) => profile.id === approval.reviewerId)?.fullName}
                  </td>
                  <td className="table-cell">
                    <Badge tone={approval.status === "approved" ? "success" : "danger"}>{approval.status}</Badge>
                  </td>
                  <td className="table-cell">{approval.note}</td>
                  <td className="table-cell">{formatDate(approval.reviewedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
