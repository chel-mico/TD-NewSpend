import React from "react";
import { View, Text, StyleSheet, FlatList, ScrollView } from "react-native";
import {
  useTransactionsQuery,
  useTransactionsByCategory,
  useTransactionsByMerchant,
  useTransactionsByCategoryAndMerchant,
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
  // Make sure the date is properly converted to a Date object
  const transactionDate = transaction.date instanceof Date 
    ? transaction.date 
    : new Date(transaction.date);
  
  const formattedDate = format(transactionDate, "EEEE MMMM d, yyyy");
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

function GroupHeader({ title, total }: { title: string; total: number }) {
  return (
    <View style={styles.groupHeader}>
      <Text style={styles.groupTitle}>{title}</Text>
      <Text style={styles.groupTotal}>{formatToDollars(total)}</Text>
    </View>
  );
}

interface TransactionListProps {
  period: Period;
  date: Date;
  showMerchants?: boolean;
  showCategories?: boolean;
}

function TransactionList({ 
  period, 
  date, 
  showMerchants = false, 
  showCategories = false 
}: TransactionListProps) {
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

  console.log('TransactionList Debug:', {
    period,
    date,
    showMerchants,
    showCategories,
    hasTransactions: transactions && transactions.length > 0,
    hasCategoryGroups: categoryGroups ? Object.keys(categoryGroups).length > 0 : false,
    hasMerchantGroups: merchantGroups ? Object.keys(merchantGroups).length > 0 : false,
    hasBothGroups: bothGroups ? Object.keys(bothGroups).length > 0 : false,
    isLoading,
    isError,
    errors: {
      basic: isErrorBasic,
      category: isErrorCategory,
      merchant: isErrorMerchant,
      both: isErrorBoth
    }
  });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading transactions...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <Text>Error loading transactions</Text>
      </View>
    );
  }

  const renderBasicList = () => {
    console.log('Rendering basic list with', transactions?.length || 0, 'transactions');
    
    if (!transactions || transactions.length === 0) {
      return <Text>No transactions found for this period</Text>;
    }
    
    return (
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <TransactionItem transaction={item} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    );
  };

  const renderCategoryGroups = () => {
    console.log('Rendering category groups with', categoryGroups ? Object.keys(categoryGroups).length : 0, 'categories');
    
    if (!categoryGroups || Object.keys(categoryGroups).length === 0) {
      return <Text>No categories found for this period</Text>;
    }
    
    return (
      <ScrollView>
        {Object.entries(categoryGroups || {}).map(([category, categoryTransactions]) => {
          if (!categoryTransactions) return null;
          const total = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
          return (
            <View key={category} style={styles.group}>
              <GroupHeader title={category} total={total} />
              {categoryTransactions.map((transaction) => (
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
  };

  const renderMerchantGroups = () => {
    console.log('Rendering merchant groups with', merchantGroups ? Object.keys(merchantGroups).length : 0, 'merchants');
    
    if (!merchantGroups || Object.keys(merchantGroups).length === 0) {
      return <Text>No merchants found for this period</Text>;
    }
    
    return (
      <ScrollView>
        {Object.entries(merchantGroups || {}).map(([merchant, merchantTransactions]) => {
          if (!merchantTransactions) return null;
          const total = merchantTransactions.reduce((sum, t) => sum + t.amount, 0);
          return (
            <View key={merchant} style={styles.group}>
              <GroupHeader title={merchant} total={total} />
              {merchantTransactions.map((transaction) => (
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
  };

  const renderBothGroups = () => {
    console.log('Rendering both groups with', bothGroups ? Object.keys(bothGroups).length : 0, 'categories');
    
    if (!bothGroups || Object.keys(bothGroups).length === 0) {
      return <Text>No categories or merchants found for this period</Text>;
    }
    
    return (
      <ScrollView>
        {Object.entries(bothGroups || {}).map(([category, merchantGroups]) => {
          if (!merchantGroups || Object.keys(merchantGroups).length === 0) return null;
          
          const categoryTotal = Object.values(merchantGroups)
            .flat()
            .reduce((sum, t) => sum + t.amount, 0);
          
          return (
            <View key={category} style={styles.categoryGroup}>
              <GroupHeader title={category} total={categoryTotal} />
              {Object.entries(merchantGroups).map(([merchant, transactions]) => {
                if (!transactions || transactions.length === 0) return null;
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
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Transactions</Text>
      {!showCategories && !showMerchants && renderBasicList()}
      {showCategories && !showMerchants && renderCategoryGroups()}
      {!showCategories && showMerchants && renderMerchantGroups()}
      {showCategories && showMerchants && renderBothGroups()}
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
    marginBottom: 4,
  },
  underline: {
    height: 4,
    width: "100%",
    borderRadius: 50,
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
