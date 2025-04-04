import { useQuery } from "@tanstack/react-query";
import { isSameDay, isSameMonth, isSameWeek, isSameYear } from "date-fns";
import {
  type Category,
  type Transaction,
  TRANSACTIONS,
} from "@/constants/Transactions";

export type Frequency = "daily" | "weekly" | "monthly" | "yearly";

const MONDAY = 1;

function filterTransactions(frequency: Frequency, period: Date) {
  return TRANSACTIONS.filter((tr) => {
    const trDate = new Date(tr.date);

    switch (frequency) {
      case "daily":
        return isSameDay(trDate, period);
      case "weekly":
        return isSameWeek(trDate, period, { weekStartsOn: MONDAY });
      case "monthly":
        return isSameMonth(trDate, period);
      case "yearly":
        return isSameYear(trDate, period);
      default:
        return false;
    }
  });
}

async function fetchTransactions(frequency: Frequency, period: Date) {
  const filtered = filterTransactions(frequency, period);
  return filtered.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function useTransactionsQuery(frequency: Frequency, period: Date) {
  return useQuery({
    queryKey: ["transactions", frequency, period],
    queryFn: async () => fetchTransactions(frequency, period),
  });
}

async function fetchTransactionsByCategory(frequency: Frequency, period: Date) {
  const filtered = filterTransactions(frequency, period);
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

export function useTransactionsByCategory(frequency: Frequency, period: Date) {
  return useQuery({
    queryKey: ["transactionsByCategory", frequency, period],
    queryFn: async () => fetchTransactionsByCategory(frequency, period),
  });
}

async function fetchTransactionsByMerchant(frequency: Frequency, period: Date) {
  const filtered = filterTransactions(frequency, period);
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

export function useTransactionsByMerchant(frequency: Frequency, period: Date) {
  return useQuery({
    queryKey: ["transactionsByCategory", frequency, period],
    queryFn: async () => fetchTransactionsByMerchant(frequency, period),
  });
}

async function fetchTransactionsByCategoryAndMerchant(
  frequency: Frequency,
  period: Date,
) {
  const groupedByCategory = await fetchTransactionsByCategory(
    frequency,
    period,
  );

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
  frequency: Frequency,
  period: Date,
) {
  return useQuery({
    queryKey: ["transactionsByCategory", frequency, period],
    queryFn: async () =>
      fetchTransactionsByCategoryAndMerchant(frequency, period),
  });
}
