import { useMemo, useState } from "react";
import { TransactionTable } from "../../components/transactions/TransactionTable";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { useFinance } from "../../contexts/FinanceContext";
import type { TransactionStatus } from "../../types";

const statuses: Array<"all" | TransactionStatus> = ["all", "draft", "pending", "approved", "rejected"];

export function ManageTransactionsPage() {
  const { transactions } = useFinance();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | TransactionStatus>("all");
  const filtered = useMemo(
    () =>
      transactions.filter((transaction) => {
        const matchQuery = transaction.title.toLowerCase().includes(query.toLowerCase());
        const matchStatus = status === "all" || transaction.status === status;
        return matchQuery && matchStatus;
      }),
    [query, status],
  );

  return (
    <section>
      <SectionHeader
        title="Manage Transactions"
        description="Bendahara bisa edit draft/rejected, submit approval, dan melihat status review."
      />
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input className="field sm:max-w-sm" placeholder="Cari transaksi" value={query} onChange={(event) => setQuery(event.target.value)} />
        <select className="field sm:max-w-xs" value={status} onChange={(event) => setStatus(event.target.value as "all" | TransactionStatus)}>
          {statuses.map((item) => (
            <option key={item} value={item}>{item === "all" ? "Semua status" : item}</option>
          ))}
        </select>
      </div>
      <div className="mt-4">
        <TransactionTable transactions={filtered} detailBasePath="/treasurer/transactions" />
      </div>
    </section>
  );
}
