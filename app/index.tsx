import { View, StyleSheet } from "react-native";
import { useState } from "react";

import { ToggleButton } from "@/components/ToggleButton";
import TransactionList from "@/components/TransactionList";

export default function HomeScreen() {
  const [merchants, setMerchants] = useState(false);
  const [categories, setCategories] = useState(false);

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
      </View>
      <TransactionList frequency="weekly" period={new Date()} />
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
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
