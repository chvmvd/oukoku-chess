import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Pressable, StyleSheet, type PressableProps } from "react-native";
import { theme } from "@/constants/theme";

type IconButtonProps = {
  label: string;
  icon: SymbolViewProps["name"];
  onPress: PressableProps["onPress"];
};

export function IconButton({ label, icon, onPress }: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressedButton]}
    >
      <SymbolView
        name={icon}
        size={32}
        tintColor={theme.colors.primary}
        accessible={false}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  pressedButton: {
    opacity: 0.7,
  },
});
