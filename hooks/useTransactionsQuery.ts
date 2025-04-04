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
  console.log('Filter Transactions:', { 
    period, 
    date, 
    totalTransactions: TRANSACTIONS.length,
    firstTransactionDate: TRANSACTIONS.length > 0 ? new Date(TRANSACTIONS[0].date) : null
  });
  
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
  console.log('fetchTransactions:', { 
    period, 
    date, 
    filteredCount: filtered.length,
    sampleTransaction: filtered.length > 0 ? filtered[0] : null 
  });
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

// Helper function to group by since Object.groupBy might not be available in all environments
function groupBy<T>(array: T[], keyFn: (item: T) => string): Record<string, T[]> {
  return array.reduce((result, item) => {
    const key = keyFn(item);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

async function fetchTransactionsByCategory(period: Period, date: Date) {
  const filtered = filterTransactions(period, date);
  const groupedByCategory = groupBy(
    filtered,
    (transaction) => transaction.category
  );

  Object.keys(groupedByCategory).forEach((category) => {
    const transactions = groupedByCategory[category as Category];
    if (transactions) {
      transactions.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    }
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
  const groupedByMerchant = groupBy(
    filtered,
    (transaction) => transaction.merchant
  );

  Object.keys(groupedByMerchant).forEach((merchant) => {
    const transactions = groupedByMerchant[merchant];
    if (transactions) {
      transactions.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    }
  });

  return groupedByMerchant;
}

export function useTransactionsByMerchant(period: Period, date: Date) {
  return useQuery({
    queryKey: ["transactionsByMerchant", period, date],
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

  const groupByMerchant = (transactions: Transaction[]) => {
    const grouped = groupBy(transactions, (tr) => tr.merchant);
    
    return Object.fromEntries(
      Object.entries(grouped).map(
        ([merchant, merchantTransactions]) => [
          merchant,
          sortTransactionsByDate(merchantTransactions),
        ],
      ),
    );
  };

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
    queryKey: ["transactionsByCategoryAndMerchant", period, date],
    queryFn: async () => fetchTransactionsByCategoryAndMerchant(period, date),
  });
}
