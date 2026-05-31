import { RotateCcw } from "lucide-react";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { useFinance } from "../../contexts/FinanceContext";
import { getCategoryName } from "../../services/financeService";
import { formatCurrency, statusTone } from "../../utils/format";
import { statusLabels } from "../../constants/routes";

export function ApprovalRequestsPage() {
  const { transactions, categories } = useFinance();
  const requests = transactions.filter((transaction) => transaction.status === "pending" || transaction.status === "rejected");

  return (
    <section>
      <SectionHeader
        title="Approval Requests"
        description="Pantau transaksi yang sedang direview atau perlu diperbaiki setelah rejection."
      />
      <div className="mt-6 grid gap-4">
        {requests.map((transaction) => (
          <article key={transaction.id} className="card p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold text-slate-950">{transaction.title}</h2>
                  <Badge tone={statusTone(transaction.status)}>{statusLabels[transaction.status]}</Badge>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  {getCategoryName(transaction.categoryId, categories)} - {formatCurrency(transaction.amount)}
                </p>
                {transaction.reviewNote && (
                  <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{transaction.reviewNote}</p>
                )}
              </div>
              {transaction.status === "rejected" && (
                <Button variant="secondary" icon={<RotateCcw size={16} />} type="button">
                  Perbaiki dan Resubmit
                </Button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
