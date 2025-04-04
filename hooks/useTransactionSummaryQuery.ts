import {
  startOfDay,
  startOfWeek,
  startOfMonth,
  startOfYear,
  subDays,
  subWeeks,
  subMonths,
  subYears,
} from "date-fns";
import type { Period } from "@/hooks/useTransactionsQuery";
import { TRANSACTIONS } from "@/constants/Transactions";
import { useQuery } from "@tanstack/react-query";

export type TransactionSummary = {
  date: Date;
  deposit: number;
  withdrawal: number;
};

export function formatToDollars(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function roundToTwo(num: number): number {
  return Math.round(num * 100) / 100;
}

// Example usage:
const value = 3.14159;
console.log(roundToTwo(value)); // 3.14

export function aggregateTransactions(period: Period): TransactionSummary[] {
  const groups = new Map<
    string,
    { date: Date; deposit: number; withdrawal: number }
  >();

  TRANSACTIONS.forEach((tx) => {
    let periodStart: Date;
    switch (period) {
      case "daily":
        periodStart = startOfDay(tx.date);
        break;
      case "weekly":
        periodStart = startOfWeek(tx.date);
        break;
      case "monthly":
        periodStart = startOfMonth(tx.date);
        break;
      case "yearly":
        periodStart = startOfYear(tx.date);
        break;
      default:
        periodStart = tx.date;
        break;
    }

    const key = periodStart.toISOString();
    if (!groups.has(key)) {
      groups.set(key, { date: periodStart, deposit: 0, withdrawal: 0 });
    }
    const group = groups.get(key)!;
    if (tx.type === "deposit") {
      group.deposit += tx.amount;
    } else if (tx.type === "withdrawal") {
      group.withdrawal += tx.amount;
    }
  });

  const now = new Date();
  let currentPeriodStart: Date;
  switch (period) {
    case "daily":
      currentPeriodStart = startOfDay(now);
      break;
    case "weekly":
      currentPeriodStart = startOfWeek(now);
      break;
    case "monthly":
      currentPeriodStart = startOfMonth(now);
      break;
    case "yearly":
      currentPeriodStart = startOfYear(now);
      break;
    default:
      currentPeriodStart = now;
      break;
  }

  const periods: Date[] = [];
  for (let i = 11; i >= 0; i--) {
    let periodDate: Date;
    switch (period) {
      case "daily":
        periodDate = subDays(currentPeriodStart, i);
        break;
      case "weekly":
        periodDate = subWeeks(currentPeriodStart, i);
        break;
      case "monthly":
        periodDate = subMonths(currentPeriodStart, i);
        break;
      case "yearly":
        periodDate = subYears(currentPeriodStart, i);
        break;
      default:
        periodDate = currentPeriodStart;
        break;
    }
    periods.push(periodDate);
  }

  const result = periods
    .map((pDate) => {
      const key = pDate.toISOString();
      const agg = groups.get(key);
      return agg ? agg : { date: pDate, deposit: 0, withdrawal: 0 };
    })
    .map((agg) => ({
      ...agg,
      withdrawal: roundToTwo(agg.withdrawal),
      deposit: roundToTwo(agg.deposit),
    }));

  return result;
}

export function useTransactionSummaryQuery(period: Period) {
  return useQuery({
    queryKey: ["transactions", period],
    queryFn: async () => aggregateTransactions(period),
  });
}
