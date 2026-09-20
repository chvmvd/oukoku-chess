import { theme } from "@/constants/theme";
import { SymbolView } from "expo-symbols";
import { StyleSheet, View } from "react-native";

export function Stars({ count }: { count: number }) {
  return (
    <View style={styles.stars}>
      {Array.from({ length: count }, (_, index) => (
        <SymbolView
          key={index}
          name={{ ios: "star.fill", android: "star" }}
          size={20}
          tintColor={theme.colors.primary}
          accessible={false}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stars: { flexDirection: "row", gap: 4 },
});
