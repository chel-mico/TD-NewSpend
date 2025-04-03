import { useQuery } from "@tanstack/react-query";
import { isSameDay, isSameMonth, isSameWeek, isSameYear } from "date-fns";
import { Category, TRANSACTIONS } from "@/constants/Transactions";

type Frequency = "daily" | "weekly" | "monthly" | "yearly";

function filterTransactions(frequency: Frequency, period: Date) {
  return TRANSACTIONS.filter((tr) => {
    const trDate = new Date(tr.date);

    switch (frequency) {
      case "daily":
        return isSameDay(trDate, period);
      case "weekly":
        return isSameWeek(trDate, period);
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
  return filtered.toSorted(
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
