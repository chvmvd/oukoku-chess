import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/button";
import { theme } from "@/constants/theme";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text accessibilityRole="header" style={styles.title}>
            おうこくチェス
          </Text>
          <Text style={styles.subtitle}>おうさまを つかまえたら かち！</Text>
        </View>
        <Image
          source={require("@/assets/images/home/board-preview.png")}
          style={styles.boardIllustration}
          contentFit="contain"
          accessible={false}
        />
        <View style={styles.buttonGroup}>
          <Button
            label="ふたりであそぶ"
            icon={{ ios: "person.2", android: "group" }}
            variant="filled"
            onPress={() => router.push("/two-player-game")}
          />
          <Button
            label="ひとりであそぶ"
            icon={{ ios: "person", android: "person" }}
            variant="outlined"
            onPress={() => router.push("/choose-difficulty")}
          />
          <Button
            label="あそびかた"
            icon={{ ios: "questionmark.circle", android: "help" }}
            variant="text"
            onPress={() => router.push("/how-to-play")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignSelf: "center",
    width: "100%",
    maxWidth: 600,
    padding: 24,
    gap: 24,
  },
  header: {
    gap: 8,
  },
  title: {
    color: theme.colors.text,
    ...theme.typography.display,
    textAlign: "center",
  },
  subtitle: {
    color: theme.colors.text,
    ...theme.typography.body,
    textAlign: "center",
  },
  boardIllustration: {
    flex: 1,
  },
  buttonGroup: {
    gap: 8,
  },
});
