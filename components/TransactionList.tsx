import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import {
  useTransactionsQuery,
  type Frequency,
} from "../hooks/useTransactionsQuery";
import { Transaction } from "@/constants/Transactions";
import { format } from "date-fns";

interface TransactionItemProps {
  transaction: Transaction;
}

function formatToDollars(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function TransactionItem({ transaction }: TransactionItemProps) {
  const formattedDate = format(transaction.date, "EEEE MMMM d, yyyy");
  const formattedAmount = formatToDollars(transaction.amount);
  return (
    <View style={styles.transactionItem}>
      <View style={styles.transactionDetails}>
        <Text style={styles.merchant}>{transaction.merchant}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>
      <Text style={styles.amount}>{formattedAmount}</Text>
    </View>
  );
}

interface TransactionListProps {
  frequency: Frequency;
  period: Date;
}

function TransactionList({ frequency, period }: TransactionListProps) {
  const {
    data: transactions,
    isLoading,
    isError,
  } = useTransactionsQuery(frequency, period);

  if (isLoading) {
    return <Text>Loading transactions...</Text>;
  }

  if (isError) {
    return <Text>Error loading transactions</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Transactions</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <TransactionItem transaction={item} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  merchant: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "#666",
  },
  amount: {
    fontSize: 16,
    fontWeight: "500",
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
  },
});

export default TransactionList;
