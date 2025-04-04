import React, { useEffect, useMemo, useRef } from "react";
import { View, Text, StyleSheet, FlatList, Dimensions } from "react-native";
import {
  format,
  addDays,
  addWeeks,
  addMonths,
  addYears,
  startOfWeek,
  startOfMonth,
  startOfYear,
} from "date-fns";
import { IconSymbol } from "./ui/IconSymbol";
import type { Period } from "@/hooks/useTransactionsQuery";

type ProjectorSelectMenuProps = {
  period: Period;
  onValueChange: (date: Date) => void;
};

export function ProjectorSelectMenu({
  period,
  onValueChange,
}: ProjectorSelectMenuProps) {
  const SCREEN_WIDTH = Dimensions.get("window").width;
  // Set each item's width to half the screen.
  const ITEM_WIDTH = SCREEN_WIDTH / 2;
  // Side padding so that the centered item is exactly in the middle:
  // (SCREEN_WIDTH - ITEM_WIDTH) / 2 = (SCREEN_WIDTH - SCREEN_WIDTH/2) / 2 = SCREEN_WIDTH/4.
  const SIDE_PADDING = SCREEN_WIDTH / 4;

  const now = useMemo(() => new Date(), []); // current date at mount time

  // Build the list of dates based on the period.
  const dateList = useMemo(() => {
    if (period === "daily") {
      const count = 365;
      const startDate = addDays(now, -(count - 1));
      return Array.from({ length: count }, (_, i) => addDays(startDate, i));
    } else if (period === "weekly") {
      const count = 52;
      const baseWeek = startOfWeek(now);
      const startDate = addWeeks(baseWeek, -(count - 1));
      return Array.from({ length: count }, (_, i) => addWeeks(startDate, i));
    } else if (period === "monthly") {
      const count = 12;
      const baseMonth = startOfMonth(now);
      const startDate = addMonths(baseMonth, -(count - 1));
      return Array.from({ length: count }, (_, i) => addMonths(startDate, i));
    } else if (period === "yearly") {
      const count = 12;
      const baseYear = startOfYear(now);
      const startDate = addYears(baseYear, -(count - 1));
      return Array.from({ length: count }, (_, i) => addYears(startDate, i));
    }
    return [];
  }, [period, now]);

  const flatListRef = useRef<FlatList<Date>>(null);

  // When the period changes, scroll to the rightmost (current) date.
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: dateList.length - 1,
        animated: true,
      });
    }
  }, [period, dateList]);

  // onViewableItemsChanged callback to track the current visible index.
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: any[]; changed: any[] }) => {
      if (viewableItems.length > 0) {
        // With snapToInterval, we expect one item to be mostly visible.
        const viewableIndex = viewableItems[0].index;
        if (viewableIndex != null) {
          const selectedDate = dateList[viewableIndex];
          onValueChange(selectedDate);
        }
      }
    },
  ).current;

  const viewabilityConfig = { itemVisiblePercentThreshold: 50 };

  // Render each date item.
  const renderItem = ({ item }: { item: Date }) => {
    // Example fixed bar values.
    const greenValue = 789;
    const redValue = 345;
    const maxValue = Math.max(greenValue, redValue);
    const greenBarHeight = (100 * greenValue) / maxValue;
    const redBarHeight = (100 * redValue) / maxValue;

    // Format the label based on period.
    let label = "";
    if (period === "daily") {
      label = format(item, "MMM dd yyyy");
    } else if (period === "weekly") {
      label = `Week of ${format(startOfWeek(item), "EEE MMM dd yyyy")}`;
    } else if (period === "monthly") {
      label = format(startOfMonth(item), "MMMM");
    } else if (period === "yearly") {
      label = format(startOfYear(item), "yyyy");
    }

    return (
      <View style={[styles.item, { width: ITEM_WIDTH }]}>
        <View style={styles.barsContainer}>
          <View style={styles.barWrapper}>
            <Text style={styles.barValue}>${greenValue}</Text>
            <View
              style={[
                styles.bar,
                styles.greenBar,
                { height: `${greenBarHeight}%` },
              ]}
            />
          </View>
          <View style={styles.barWrapper}>
            <Text style={styles.barValue}>${redValue}</Text>
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
        data={dateList}
        horizontal
        // Remove pagingEnabled; use snapToInterval based on ITEM_WIDTH.
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: SIDE_PADDING }}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.toISOString()}
        renderItem={({ item }) => renderItem({ item })}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index,
          index,
        })}
        initialScrollIndex={dateList.length - 1} // The current period is the last element
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
