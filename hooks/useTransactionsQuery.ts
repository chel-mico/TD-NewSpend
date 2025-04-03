import { useQuery } from "@tanstack/react-query";
import { isSameDay, isSameMonth, isSameYear } from "date-fns";
import { TRANSACTIONS } from "@/constants/Transactions";

type Frequency = "monthly" | "yearly" | "daily";

async function fetchTransactions(frequency: Frequency, period: Date) {
  const filtered = TRANSACTIONS.filter((tr) => {
    const trDate = new Date(tr.date);

    switch (frequency) {
      case "daily":
        return isSameDay(trDate, period);
      case "monthly":
        return isSameMonth(trDate, period);
      case "yearly":
        return isSameYear(trDate, period);
      default:
        return false;
    }
  });

  // Sort by recency: newest first
  return filtered.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function useTransactionsQuery(frequency: Frequency, period: Date) {
  return useQuery({
    queryKey: ["transactionsQuery", frequency, period],
    queryFn: async () => fetchTransactions(frequency, period),
  });
}
