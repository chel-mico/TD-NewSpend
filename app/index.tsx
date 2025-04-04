import { View, StyleSheet } from "react-native";
import { useState } from "react";

import { ToggleButton } from "@/components/ToggleButton";
import TransactionList from "@/components/TransactionList";
import { PeriodSelectMenu } from "@/components/PeriodSelectMenu";
import type { Period } from "@/hooks/useTransactionsQuery";
import { ProjectorSelectMenu } from "@/components/ProjectorSelectMenu";

const today = new Date();
export default function HomeScreen() {
  const [merchants, setMerchants] = useState(false);
  const [categories, setCategories] = useState(false);
  const [period, setPeriod] = useState<Period>("monthly");
  const [date, setDate] = useState(today);

  return (
    <View style={styles.container}>
      <ProjectorSelectMenu
        period={period}
        onValueChange={(date) => {
          setDate(date);
          console.log(date);
        }}
      />
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
        <PeriodSelectMenu
          selectedValue={period}
          onValueChange={(p) => {
            setPeriod(p);
            setDate(new Date());
          }}
        />
      </View>
      <TransactionList period={period} date={date} />
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
