import { IconButton } from "@/components/icon-button";
import { theme } from "@/constants/theme";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const steps = [
  {
    title: "こまを えらぶ",
    image: require("@/assets/images/how-to-play/select-piece.png"),
    description: "自分の番になったら、動かしたいコマを選ぼう。",
  },
  {
    title: "ばしょを えらぶ",
    image: require("@/assets/images/how-to-play/select-destination.png"),
    description:
      "コマをどこに動かすか選ぼう。相手のコマがいたら、つかまえられるよ。",
  },
  {
    title: "おうさまを つかまえたら かち！",
    image: require("@/assets/images/how-to-play/capture-king.png"),
    description: "相手のおうさまをつかまえたら勝ち！",
  },
];

export default function HowToPlayScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <IconButton
          label="戻る"
          icon={{ ios: "chevron.left", android: "arrow_back" }}
          onPress={() => router.back()}
        />
        <Text accessibilityRole="header" style={styles.title}>
          あそびかた
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.steps}>
        {steps.map((step, index) => (
          <View key={step.title} style={styles.step}>
            <View
              accessible
              accessibilityRole="header"
              style={styles.stepHeader}
            >
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepTitle}>{step.title}</Text>
            </View>
            <Image
              source={step.image}
              style={styles.stepImage}
              contentFit="contain"
              accessible
              accessibilityLabel={step.description}
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 12,
    paddingRight: 68,
    paddingVertical: 4,
  },
  title: {
    flex: 1,
    ...theme.typography.title,
    color: theme.colors.text,
    textAlign: "center",
  },
  steps: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 12,
  },
  step: {
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 24,
    backgroundColor: theme.colors.surface,
  },
  stepHeader: {
    flexDirection: "row",
    gap: 8,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
  },
  stepNumberText: {
    ...theme.typography.body,
    lineHeight: 28,
    color: theme.colors.onPrimary,
  },
  stepTitle: {
    flex: 1,
    ...theme.typography.body,
    color: theme.colors.text,
  },
  stepImage: {
    width: "100%",
    aspectRatio: 4 / 5,
  },
});
