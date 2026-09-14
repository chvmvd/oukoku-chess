import { IconButton } from "@/components/icon-button";
import { Stars } from "@/components/stars";
import { pieceImages } from "@/constants/pieces";
import { theme } from "@/constants/theme";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChooseDifficultyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <IconButton
          label="戻る"
          icon={{ ios: "chevron.left", android: "arrow_back" }}
          onPress={() => router.back()}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text accessibilityRole="header" style={styles.title}>
          つよさを えらんでね
        </Text>
        <View style={styles.cards}>
          {(["easy", "normal", "hard"] as const).map((difficulty) => (
            <Pressable
              key={difficulty}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.card,
                pressed && styles.pressedCard,
              ]}
              onPress={() =>
                router.push({
                  pathname: "/single-player-game",
                  params: { difficulty },
                })
              }
            >
              <Image
                source={pieceImages.blue.king}
                style={styles.opponentImage}
                accessible={false}
              />
              <View style={styles.cardContent}>
                <Text style={styles.difficultyLabel}>
                  {difficulty === "easy"
                    ? "やさしい"
                    : difficulty === "normal"
                      ? "ふつう"
                      : "つよい"}
                </Text>
                <Stars
                  count={
                    difficulty === "easy" ? 1 : difficulty === "normal" ? 2 : 3
                  }
                />
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { flexDirection: "row", paddingHorizontal: 12, paddingVertical: 4 },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 32,
    gap: 32,
  },
  title: {
    ...theme.typography.headline,
    color: theme.colors.text,
    textAlign: "center",
  },
  cards: { gap: 16 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
    padding: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  pressedCard: { opacity: 0.7 },
  opponentImage: { width: 72, height: 72 },
  cardContent: { gap: 8 },
  difficultyLabel: { ...theme.typography.bodyLarge, color: theme.colors.text },
});
