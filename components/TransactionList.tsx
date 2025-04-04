import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from "react-native";
import {
  useTransactionsQuery,
  useTransactionsByCategory,
  useTransactionsByMerchant,
  useTransactionsByCategoryAndMerchant,
  type Period,
} from "../hooks/useTransactionsQuery";
import { Transaction, type Category } from "@/constants/Transactions";
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
  const underlineColor = isDeposit ? "#5FC66E" : "#D96C6E"; // Green/Red colors

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

type GroupingMode = "none" | "category" | "merchant" | "both";

interface GroupSelectorProps {
  selectedMode: GroupingMode;
  onSelectMode: (mode: GroupingMode) => void;
}

function GroupSelector({ selectedMode, onSelectMode }: GroupSelectorProps) {
  return (
    <View style={styles.groupSelector}>
      <TouchableOpacity
        style={[styles.groupButton, selectedMode === "none" && styles.selectedButton]}
        onPress={() => onSelectMode("none")}
      >
        <Text style={[styles.groupButtonText, selectedMode === "none" && styles.selectedButtonText]}>
          None
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.groupButton, selectedMode === "category" && styles.selectedButton]}
        onPress={() => onSelectMode("category")}
      >
        <Text style={[styles.groupButtonText, selectedMode === "category" && styles.selectedButtonText]}>
          By Category
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.groupButton, selectedMode === "merchant" && styles.selectedButton]}
        onPress={() => onSelectMode("merchant")}
      >
        <Text style={[styles.groupButtonText, selectedMode === "merchant" && styles.selectedButtonText]}>
          By Merchant
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.groupButton, selectedMode === "both" && styles.selectedButton]}
        onPress={() => onSelectMode("both")}
      >
        <Text style={[styles.groupButtonText, selectedMode === "both" && styles.selectedButtonText]}>
          Category & Merchant
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function GroupHeader({ title, total }: { title: string; total: number }) {
  return (
    <View style={styles.groupHeader}>
      <Text style={styles.groupTitle}>{title}</Text>
      <Text style={styles.groupTotal}>{formatToDollars(total)}</Text>
    </View>
  );
}

function TransactionList({ period, date }: TransactionListProps) {
  const [groupingMode, setGroupingMode] = useState<GroupingMode>("none");

  const {
    data: transactions,
    isLoading: isLoadingBasic,
    isError: isErrorBasic,
  } = useTransactionsQuery(period, date);

  const {
    data: categoryGroups,
    isLoading: isLoadingCategory,
    isError: isErrorCategory,
  } = useTransactionsByCategory(period, date);

  const {
    data: merchantGroups,
    isLoading: isLoadingMerchant,
    isError: isErrorMerchant,
  } = useTransactionsByMerchant(period, date);

  const {
    data: bothGroups,
    isLoading: isLoadingBoth,
    isError: isErrorBoth,
  } = useTransactionsByCategoryAndMerchant(period, date);

  const isLoading = isLoadingBasic || isLoadingCategory || isLoadingMerchant || isLoadingBoth;
  const isError = isErrorBasic || isErrorCategory || isErrorMerchant || isErrorBoth;

  if (isLoading) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  if (isError) {
    return <View style={styles.container}><Text>Error loading transactions</Text></View>;
  }

  const renderBasicList = () => (
    <FlatList
      data={transactions}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <TransactionItem transaction={item} />}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );

  const renderCategoryGroups = () => (
    <ScrollView>
      {Object.entries(categoryGroups).map(([category, transactions]) => {
        const total = transactions.reduce((sum, t) => sum + t.amount, 0);
        return (
          <View key={category} style={styles.group}>
            <GroupHeader title={category} total={total} />
            {transactions.map((transaction) => (
              <React.Fragment key={transaction.id}>
                <TransactionItem transaction={transaction} />
                <View style={styles.separator} />
              </React.Fragment>
            ))}
          </View>
        );
      })}
    </ScrollView>
  );

  const renderMerchantGroups = () => (
    <ScrollView>
      {Object.entries(merchantGroups).map(([merchant, transactions]) => {
        const total = transactions.reduce((sum, t) => sum + t.amount, 0);
        return (
          <View key={merchant} style={styles.group}>
            <GroupHeader title={merchant} total={total} />
            {transactions.map((transaction) => (
              <React.Fragment key={transaction.id}>
                <TransactionItem transaction={transaction} />
                <View style={styles.separator} />
              </React.Fragment>
            ))}
          </View>
        );
      })}
    </ScrollView>
  );

  const renderBothGroups = () => (
    <ScrollView>
      {Object.entries(bothGroups).map(([category, merchantGroups]) => {
        const categoryTotal = Object.values(merchantGroups)
          .flat()
          .reduce((sum, t) => sum + t.amount, 0);
        
        return (
          <View key={category} style={styles.categoryGroup}>
            <GroupHeader title={category} total={categoryTotal} />
            {Object.entries(merchantGroups).map(([merchant, transactions]) => {
              const merchantTotal = transactions.reduce((sum, t) => sum + t.amount, 0);
              return (
                <View key={`${category}-${merchant}`} style={styles.merchantGroup}>
                  <GroupHeader title={merchant} total={merchantTotal} />
                  {transactions.map((transaction) => (
                    <React.Fragment key={transaction.id}>
                      <TransactionItem transaction={transaction} />
                      <View style={styles.separator} />
                    </React.Fragment>
                  ))}
                </View>
              );
            })}
          </View>
        );
      })}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Transactions</Text>
      <GroupSelector selectedMode={groupingMode} onSelectMode={setGroupingMode} />
      {groupingMode === "none" && renderBasicList()}
      {groupingMode === "category" && renderCategoryGroups()}
      {groupingMode === "merchant" && renderMerchantGroups()}
      {groupingMode === "both" && renderBothGroups()}
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
    fontSize: 14,
    paddingBottom: 7,
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
  groupSelector: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 8,
    flexWrap: "wrap",
  },
  groupButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
  },
  selectedButton: {
    backgroundColor: "#007AFF",
  },
  groupButtonText: {
    fontSize: 14,
    color: "#333",
  },
  selectedButtonText: {
    color: "#fff",
  },
  group: {
    marginBottom: 24,
  },
  categoryGroup: {
    marginBottom: 32,
  },
  merchantGroup: {
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  groupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    marginBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#eee",
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  groupTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
  },
});

export default TransactionList;
