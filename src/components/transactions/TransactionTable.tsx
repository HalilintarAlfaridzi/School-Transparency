import { Eye, FileCheck2 } from "lucide-react";
import { Link } from "react-router-dom";
import { statusLabels } from "../../constants/routes";
import { useFinance } from "../../contexts/FinanceContext";
import { getCategoryName, getEvidenceForTransaction } from "../../services/financeService";
import type { Transaction } from "../../types";
import { formatCurrency, formatDate, statusTone, transactionSign } from "../../utils/format";
import { Badge } from "../ui/Badge";

export function TransactionTable({
  transactions,
  detailBasePath = "/reports",
  publicOnly = false,
}: {
  transactions: Transaction[];
  detailBasePath?: string;
  publicOnly?: boolean;
}) {
  const { categories, evidence } = useFinance();

  return (
    <div className="card overflow-hidden">
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="table-head">
            <tr>
              <th className="px-4 py-3">Tanggal</th>
              <th className="px-4 py-3">Transaksi</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Nominal</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Bukti</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => {
              const proofCount = getEvidenceForTransaction(transaction.id, evidence, publicOnly).length;
              return (
                <tr key={transaction.id} className="hover:bg-slate-50">
                  <td className="table-cell whitespace-nowrap">{formatDate(transaction.transactionDate)}</td>
                  <td className="table-cell">
                    <p className="font-semibold text-slate-950">{transaction.title}</p>
                    <p className="mt-1 line-clamp-1 max-w-md text-xs text-slate-500">
                      {transaction.description}
                    </p>
                  </td>
                  <td className="table-cell">{getCategoryName(transaction.categoryId, categories)}</td>
                  <td className="table-cell whitespace-nowrap font-semibold">
                    <span className={transaction.type === "income" ? "text-emerald-700" : "text-slate-900"}>
                      {transactionSign(transaction.type)} {formatCurrency(transaction.amount)}
                    </span>
                  </td>
                  <td className="table-cell">
                    <Badge tone={statusTone(transaction.status)}>{statusLabels[transaction.status]}</Badge>
                  </td>
                  <td className="table-cell">
                    <span className="inline-flex items-center gap-1 text-sm text-slate-600">
                      <FileCheck2 size={15} /> {proofCount}
                    </span>
                  </td>
                  <td className="table-cell">
                    <Link
                      to={`${detailBasePath}/${transaction.id}`}
                      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-semibold text-trust hover:bg-blue-50"
                    >
                      <Eye size={15} /> Detail
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="grid gap-3 p-3 md:hidden">
        {transactions.map((transaction) => (
          <article key={transaction.id} className="rounded-lg border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500">{formatDate(transaction.transactionDate)}</p>
                <h3 className="mt-1 font-semibold text-slate-950">{transaction.title}</h3>
              </div>
              <Badge tone={statusTone(transaction.status)}>{statusLabels[transaction.status]}</Badge>
            </div>
            <p className="mt-3 text-sm text-slate-600">{transaction.description}</p>
            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="font-semibold text-slate-950">
                {transactionSign(transaction.type)} {formatCurrency(transaction.amount)}
              </p>
              <Link className="text-sm font-semibold text-trust" to={`${detailBasePath}/${transaction.id}`}>
                Detail
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
