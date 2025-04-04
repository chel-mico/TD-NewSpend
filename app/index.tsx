import { View, StyleSheet } from "react-native";
import { useState } from "react";

import { ToggleButton } from "@/components/ToggleButton";
import TransactionList from "@/components/TransactionList";
import { PeriodSelectMenu } from "@/components/PeriodSelectMenu";
import type { Period } from "@/hooks/useTransactionsQuery";

export default function HomeScreen() {
  const [merchants, setMerchants] = useState(false);
  const [categories, setCategories] = useState(false);
  const [period, setPeriod] = useState<Period>("monthly");

  return (
    <View style={styles.container}>
      <View style={styles.menuContainer}>
        <ToggleButton
          label="Merchants"
          isActive={merchants}
          onToggle={() => setMerchants((v) => !v)}
        />
        <ToggleButton
          label="Categories"
          isActive={categories}
          onToggle={() => setCategories((v) => !v)}
        />
        <PeriodSelectMenu selectedValue={period} onValueChange={setPeriod} />
      </View>
      <TransactionList period={period} date={new Date()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  menuContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 3,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
