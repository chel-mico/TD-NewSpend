import type { Period } from "@/hooks/useTransactionsQuery";
import { StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

type PeriodSelectMenuProps = {
  selectedValue: Period;
  onValueChange: (value: Period) => void;
};

const data = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

export function PeriodSelectMenu({
  selectedValue,
  onValueChange,
}: PeriodSelectMenuProps) {
  return (
    <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      iconStyle={styles.iconStyle}
      data={data}
      search={false}
      maxHeight={300}
      labelField="label"
      valueField="value"
      value={selectedValue}
      onChange={(item) => {
        onValueChange(item.value);
      }}
    />
  );
}

const styles = StyleSheet.create({
  dropdown: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#F0F0F0",
    borderRadius: 6,
  },
  placeholderStyle: {
    color: "#000",
    fontSize: 14,
  },
  selectedTextStyle: {
    color: "#000",
    fontSize: 14,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});

export default PeriodSelectMenu;
