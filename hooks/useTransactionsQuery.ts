import { TRANSACTIONS } from "@/constants/Transactions";
import { useQuery } from "@tanstack/react-query";

type Frequency = "monthly" | "yearly" | "daily";

async function fetchTransactions(frequency: Frequency, period: Date) {
  return TRANSACTIONS;
}

export function useTransactionsQuery(frequency: Frequency, period: Date) {
  return useQuery({
    queryKey: ["transactionsQuery", frequency, period],
    queryFn: async () => fetchTransactions(frequency, period),
  });
}
