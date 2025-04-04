import React, { useEffect, useMemo, useRef } from "react";
import { View, Text, StyleSheet, FlatList, Dimensions } from "react-native";
import { format, startOfWeek, startOfMonth, startOfYear } from "date-fns";
import { IconSymbol } from "./ui/IconSymbol";
import type { Period } from "@/hooks/useTransactionsQuery";
import {
  type TransactionSummary,
  useTransactionSummaryQuery,
} from "@/hooks/useTransactionSummaryQuery";

type ProjectorSelectMenuProps = {
  period: Period;
  onValueChange: (date: Date) => void;
};

export function ProjectorSelectMenu({
  period,
  onValueChange,
}: ProjectorSelectMenuProps) {
  const SCREEN_WIDTH = Dimensions.get("window").width;
  const ITEM_WIDTH = SCREEN_WIDTH / 2;
  const SIDE_PADDING = SCREEN_WIDTH / 4;

  const now = useMemo(() => new Date(), []); // current date at mount time

  const { data: transactionSummaries } = useTransactionSummaryQuery(period);
  const maxValue = useMemo(
    () => Math.max(...(transactionSummaries?.map((ts) => ts.deposit) ?? [])),
    [period],
  );

  const flatListRef = useRef<FlatList<TransactionSummary>>(null);

  // When the period changes, scroll to the rightmost (current) date.
  useEffect(() => {
    if (flatListRef.current && transactionSummaries) {
      flatListRef.current.scrollToIndex({
        index: transactionSummaries.length - 1,
        animated: true,
      });
    }
  }, [period, now, flatListRef.current]);

  // onViewableItemsChanged callback to track the current visible index.
  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: any[];
    changed: any[];
  }) => {
    if (viewableItems.length > 0) {
      // With snapToInterval, we expect one item to be mostly visible.
      const viewableIndex = viewableItems[0].index;
      if (viewableIndex != null && transactionSummaries) {
        const selectedDate = transactionSummaries[viewableIndex].date;
        onValueChange(selectedDate);
      }
    }
  };

  const viewabilityConfig = { itemVisiblePercentThreshold: 50 };

  // Render each date item.
  const renderItem = ({ date, withdrawal, deposit }: TransactionSummary) => {
    const greenBarHeight = (110 * deposit) / maxValue;
    const redBarHeight = (110 * withdrawal) / maxValue;

    // Format the label based on period.
    let label = "";
    if (period === "daily") {
      label = format(date, "MMM dd yyyy");
    } else if (period === "weekly") {
      label = `Week of ${format(startOfWeek(date, { weekStartsOn: 1 }), "MMM dd yyyy")}`;
    } else if (period === "monthly") {
      label = format(startOfMonth(date), "MMMM");
    } else if (period === "yearly") {
      label = format(startOfYear(date), "yyyy");
    }

    return (
      <View style={[styles.item, { width: ITEM_WIDTH }]}>
        <View style={styles.barsContainer}>
          <View style={styles.barWrapper}>
            <Text style={styles.barValue}>${deposit}</Text>
            <View
              style={[
                styles.bar,
                styles.greenBar,
                { height: `${greenBarHeight}%` },
              ]}
            />
          </View>
          <View style={styles.barWrapper}>
            <Text style={styles.barValue}>${withdrawal}</Text>
            <View
              style={[
                styles.bar,
                styles.redBar,
                { height: `${redBarHeight}%` },
              ]}
            />
          </View>
        </View>
        <Text style={styles.periodLabel}>{label}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={transactionSummaries ?? []}
        horizontal
        // Remove pagingEnabled; use snapToInterval based on ITEM_WIDTH.
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: SIDE_PADDING }}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.date.toISOString()}
        renderItem={({ item }) => renderItem(item)}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index,
          index,
        })}
        initialScrollIndex={transactionSummaries?.length ?? 1 - 1} // The current period is the last element
      />
      <IconSymbol name="triangle.fill" size={10} color="#000" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingBottom: 20,
    gap: 5,
  },
  item: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  barsContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 4,
    height: 150,
    gap: 10,
  },
  barWrapper: {
    alignItems: "center",
  },
  barValue: {
    marginBottom: 4,
    fontWeight: "600",
    color: "#000",
  },
  bar: {
    width: 70,
  },
  greenBar: {
    backgroundColor: "#5FC66E",
  },
  redBar: {
    backgroundColor: "#D96C6E",
  },
  periodLabel: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "600",
  },
});
