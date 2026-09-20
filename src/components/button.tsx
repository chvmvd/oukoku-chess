import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Pressable, StyleSheet, Text, type PressableProps } from "react-native";
import { theme } from "@/constants/theme";

type ButtonProps = {
  label: string;
  icon: SymbolViewProps["name"];
  variant: "filled" | "outlined" | "text";
  onPress: NonNullable<PressableProps["onPress"]>;
};

export function Button({ label, icon, variant, onPress }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === "filled" && styles.filledButton,
        variant === "outlined" && styles.outlinedButton,
        pressed && styles.pressedButton,
      ]}
    >
      <SymbolView
        name={icon}
        size={28}
        weight="medium"
        tintColor={
          variant === "filled" ? theme.colors.onPrimary : theme.colors.primary
        }
        accessible={false}
      />
      <Text style={[styles.label, variant === "filled" && styles.filledLabel]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "transparent",
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  filledButton: {
    backgroundColor: theme.colors.primary,
  },
  outlinedButton: {
    borderColor: theme.colors.primary,
  },
  pressedButton: {
    opacity: 0.7,
  },
  label: {
    flexShrink: 1,
    ...theme.typography.bodyLarge,
    color: theme.colors.primary,
    textAlign: "center",
  },
  filledLabel: {
    color: theme.colors.onPrimary,
  },
});
