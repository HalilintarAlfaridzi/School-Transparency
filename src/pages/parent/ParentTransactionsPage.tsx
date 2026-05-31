import { useMemo, useState } from "react";
import { TransactionTable } from "../../components/transactions/TransactionTable";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { useFinance } from "../../contexts/FinanceContext";
import { getPublicTransactions } from "../../services/financeService";

export function ParentTransactionsPage() {
  const [query, setQuery] = useState("");
  const { transactions: allTransactions } = useFinance();
  const transactions = getPublicTransactions(allTransactions);
  const filtered = useMemo(
    () => transactions.filter((transaction) => transaction.title.toLowerCase().includes(query.toLowerCase())),
    [query, transactions],
  );

  return (
    <section>
      <SectionHeader title="Recent Transactions" description="Daftar transaksi publik terbaru yang dapat dibuka orang tua." />
      <input
        className="field mt-6 max-w-md"
        placeholder="Cari transaksi"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <div className="mt-4">
        <TransactionTable transactions={filtered} publicOnly />
      </div>
    </section>
  );
}
