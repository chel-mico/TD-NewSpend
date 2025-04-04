import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import {
  useTransactionsQuery,
  type Period,
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
  const isDeposit = transaction.type === "deposit";
  const underlineColor = isDeposit ? "#4CAF50" : "#F44336"; // Green/Red colors

  return (
    <View style={styles.transactionContainer}>
      <View style={styles.transactionContent}>
        <Text selectable={true} style={styles.amount}>
          {formattedAmount}
        </Text>
        <View style={[styles.underline, { backgroundColor: underlineColor }]} />
      </View>
      <View style={styles.transactionInfo}>
        <Text selectable={true} style={styles.merchant}>
          {transaction.merchant}
        </Text>
        <Text selectable={true} style={styles.date}>
          {formattedDate}
        </Text>
      </View>
    </View>
  );
}

interface TransactionListProps {
  period: Period;
  date: Date;
}

function TransactionList({ period, date }: TransactionListProps) {
  const {
    data: transactions,
    isLoading,
    isError,
  } = useTransactionsQuery(period, date);

  if (isLoading) {
    // TODO: loading ui
    return <View style={styles.container}></View>;
  }

  if (isError) {
    // TODO: error ui
    return <View style={styles.container}></View>;
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
  separator: {
    height: 1,
    backgroundColor: "#eee",
  },
  transactionContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
  },
  transactionContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  transactionInfo: {
    flex: 1,
  },
  amount: {
    fontWeight: "bold",
    marginRight: 8,
    fontSize: 16,
  },
  merchant: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
  },
  date: {
    color: "#666",
    fontSize: 14,
    marginBottom: 4, // Reduced space above underline
  },
  underline: {
    height: 4, // Thicker than separator line
    width: "100%",
    borderRadius: 50, // Soften edges slightly
  },
});

export default TransactionList;
