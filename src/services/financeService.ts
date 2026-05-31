import type { Category, Evidence, Transaction, TransactionStatus, TransactionType } from "../types";

export function getCategoryName(categoryId: string, categories: Category[] = []) {
  return categories.find((category) => category.id === categoryId)?.name ?? "Tanpa kategori";
}

export function getPublicTransactions(source: Transaction[]) {
  return source.filter(
    (transaction) =>
      transaction.status === "approved" &&
      transaction.isPublic &&
      transaction.visibility === "public",
  );
}

export function getTransactionsByStatus(
  status: TransactionStatus,
  source: Transaction[],
) {
  return source.filter((transaction) => transaction.status === status);
}

export function getEvidenceForTransaction(
  transactionId: string,
  evidence: Evidence[] = [],
  publicOnly = false,
) {
  return evidence.filter(
    (item) =>
      item.transactionId === transactionId && (!publicOnly || item.visibility === "public"),
  );
}

export function summarizeTransactions(source: Transaction[]) {
  const totalIncome = source
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const totalExpense = source
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    transactionCount: source.length,
  };
}

export function categoryBreakdown(source: Transaction[], type: TransactionType) {
  const totals = source
    .filter((transaction) => transaction.type === type)
    .reduce<Record<string, number>>((acc, transaction) => {
      const categoryName = transaction.categoryName ?? "Tanpa kategori";
      acc[categoryName] = (acc[categoryName] ?? 0) + transaction.amount;
      return acc;
    }, {});

  return Object.entries(totals).map(([name, value]) => ({ name, value }));
}

export function monthlyTrend(source: Transaction[]) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const monthly = source.reduce<Record<string, { income: number; expense: number }>>(
    (acc, transaction) => {
      const month = monthNames[new Date(transaction.transactionDate).getMonth()];
      acc[month] = acc[month] ?? { income: 0, expense: 0 };
      acc[month][transaction.type] += transaction.amount;
      return acc;
    },
    {},
  );

  return Object.entries(monthly).map(([month, values]) => ({ month, ...values }));
}

export function financialHealthScore(source: Transaction[]) {
  const approvedPublic = source.filter((transaction) => transaction.status === "approved");
  const summary = summarizeTransactions(approvedPublic);
  const rejectedCount = source.filter((transaction) => transaction.status === "rejected").length;
  const balanceScore = summary.balance > 0 ? 40 : 15;
  const ratioScore =
    summary.totalIncome === 0
      ? 0
      : Math.max(0, Math.min(35, 35 - (summary.totalExpense / summary.totalIncome) * 15));
  const reviewScore = Math.max(0, 25 - rejectedCount * 4);

  return Math.round(balanceScore + ratioScore + reviewScore);
}

export function duplicateWarnings(
  transaction: Transaction,
  source: Transaction[],
) {
  return source.filter((candidate) => {
    if (candidate.id === transaction.id) return false;
    if (candidate.categoryId !== transaction.categoryId) return false;
    const amountClose = Math.abs(candidate.amount - transaction.amount) <= 500000;
    const dateGap = Math.abs(
      new Date(candidate.transactionDate).getTime() - new Date(transaction.transactionDate).getTime(),
    );
    const withinWeek = dateGap <= 7 * 24 * 60 * 60 * 1000;
    return amountClose && withinWeek;
  });
}
