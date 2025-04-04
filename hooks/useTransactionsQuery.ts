import { useQuery } from "@tanstack/react-query";
import { isSameDay, isSameMonth, isSameWeek, isSameYear } from "date-fns";
import {
  type Category,
  type Transaction,
  TRANSACTIONS,
} from "@/constants/Transactions";

export type Period = "daily" | "weekly" | "monthly" | "yearly";

const MONDAY = 1;

function filterTransactions(period: Period, date: Date) {
  return TRANSACTIONS.filter((tr) => {
    const trDate = new Date(tr.date);

    switch (period) {
      case "daily":
        return isSameDay(trDate, date);
      case "weekly":
        return isSameWeek(trDate, date, { weekStartsOn: MONDAY });
      case "monthly":
        return isSameMonth(trDate, date);
      case "yearly":
        return isSameYear(trDate, date);
      default:
        return false;
    }
  });
}

async function fetchTransactions(period: Period, date: Date) {
  const filtered = filterTransactions(period, date);
  return filtered.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function useTransactionsQuery(period: Period, date: Date) {
  return useQuery({
    queryKey: ["transactions", period, date],
    queryFn: async () => fetchTransactions(period, date),
  });
}

async function fetchTransactionsByCategory(period: Period, date: Date) {
  const filtered = filterTransactions(period, date);
  const groupedByCategory = Object.groupBy(
    filtered,
    (transaction) => transaction.category,
  );

  Object.keys(groupedByCategory).forEach((category) => {
    const transactions = groupedByCategory[category as Category];
    transactions?.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  });

  return groupedByCategory;
}

export function useTransactionsByCategory(period: Period, date: Date) {
  return useQuery({
    queryKey: ["transactionsByCategory", period, date],
    queryFn: async () => fetchTransactionsByCategory(period, date),
  });
}

async function fetchTransactionsByMerchant(period: Period, date: Date) {
  const filtered = filterTransactions(period, date);
  const groupedByMerchant = Object.groupBy(
    filtered,
    (transaction) => transaction.merchant,
  );

  Object.keys(groupedByMerchant).forEach((merchant) => {
    const transactions = groupedByMerchant[merchant as Category];
    transactions?.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  });

  return groupedByMerchant;
}

export function useTransactionsByMerchant(period: Period, date: Date) {
  return useQuery({
    queryKey: ["transactionsByCategory", period, date],
    queryFn: async () => fetchTransactionsByMerchant(period, date),
  });
}

async function fetchTransactionsByCategoryAndMerchant(
  period: Period,
  date: Date,
) {
  const groupedByCategory = await fetchTransactionsByCategory(period, date);

  // Group by merchant within each category and sort by date
  const sortTransactionsByDate = (transactions: Transaction[]) =>
    [...transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

  const groupByMerchant = (transactions: Transaction[]) =>
    Object.fromEntries(
      Object.entries(Object.groupBy(transactions, (tr) => tr.merchant)).map(
        ([merchant, merchantTransactions]) => [
          merchant,
          sortTransactionsByDate(merchantTransactions ?? []),
        ],
      ),
    );

  // Group by category and merchant, and then sort by date within each group
  return Object.entries(groupedByCategory).reduce(
    (acc, [category, transactions]) => {
      acc[category] = groupByMerchant(transactions);
      return acc;
    },
    {} as Record<string, Record<string, Transaction[]>>,
  );
}

export function useTransactionsByCategoryAndMerchant(
  period: Period,
  date: Date,
) {
  return useQuery({
    queryKey: ["transactionsByCategory", period, date],
    queryFn: async () => fetchTransactionsByCategoryAndMerchant(period, date),
  });
}
