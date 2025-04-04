import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { IconSymbol } from "./ui/IconSymbol";

type ToggleButtonProps = {
  label: string;
  isActive: boolean;
  onToggle?: () => void;
};

export function ToggleButton({ label, isActive, onToggle }: ToggleButtonProps) {
  return (
    <TouchableOpacity onPress={onToggle}>
      <View style={styles.buttonContainer}>
        <Text style={[styles.buttonLabel, isActive && styles.activeLabel]}>
          {label}
        </Text>
        <IconSymbol
          name={isActive ? "eye" : "eye.slash"}
          size={24}
          color={isActive ? "#000" : "#888"}
          weight="regular"
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#F0F0F0",
    borderRadius: 6,
  },
  buttonLabel: {
    color: "#888888",
    fontSize: 14,
  },
  activeLabel: {
    color: "#000000",
  },
});
