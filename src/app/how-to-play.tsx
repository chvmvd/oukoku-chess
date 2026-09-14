import { Chessboard } from "@/components/chessboard";
import { IconButton } from "@/components/icon-button";
import { VictoryOverlay } from "@/components/victory-overlay";
import { theme } from "@/constants/theme";
import { movePiece, selectSquare, type ChessGame } from "@/game/chess";
import { useFocusEffect, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useCallback, useState } from "react";
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useAnimatedValue,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const exampleGame: ChessGame = {
  status: "selecting-piece",
  turn: "red",
  moveCount: 0,
  board: {
    a1: null,
    b1: null,
    c1: null,
    d1: null,
    a2: null,
    b2: { color: "red", type: "queen" },
    c2: null,
    d2: null,
    a3: null,
    b3: { color: "blue", type: "king" },
    c3: null,
    d3: null,
    a4: null,
    b4: null,
    c4: null,
    d4: null,
    a5: null,
    b5: null,
    c5: null,
    d5: null,
  },
};
const steps = [
  {
    game: exampleGame,
    instruction: "こまを えらんで",
    fingerTop: "70%",
  },
  {
    game: selectSquare(exampleGame, "b2"),
    instruction: "ばしょを えらんで",
    fingerTop: "50%",
  },
  {
    game: movePiece(exampleGame, { from: "b2", to: "b3" }),
    instruction: "おうさまを\nつかまえたら かち！",
    fingerTop: null,
  },
] as const;

export default function HowToPlayScreen() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const step = steps[stepIndex];
  const progress = useAnimatedValue(0);
  useFocusEffect(
    useCallback(() => {
      progress.setValue(0);
      const animation = Animated.timing(progress, {
        toValue: 1,
        duration: 2600,
        easing: Easing.linear,
        useNativeDriver: true,
      });
      animation.start(({ finished }) => {
        if (finished) {
          progress.setValue(0);
          setStepIndex((stepIndex + 1) % steps.length);
        }
      });
      return () => animation.stop();
    }, [progress, stepIndex]),
  );

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

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.demonstration}>
          <Text
            style={styles.instruction}
            accessibilityLabel="動かしたいコマを選んで、どこに動かすか選ぼう。相手のおうさまをつかまえたら勝ち！"
          >
            {step.instruction}
          </Text>
          <View
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            pointerEvents="none"
          >
            <Chessboard game={step.game} />
            {step.fingerTop && (
              <Animated.View
                style={[
                  styles.finger,
                  {
                    top: step.fingerTop,
                    opacity: progress.interpolate({
                      inputRange: [0, 0.3, 0.5, 1],
                      outputRange: [0, 0, 1, 1],
                    }),
                    transform: [
                      {
                        scale: progress.interpolate({
                          inputRange: [0, 0.8, 1],
                          outputRange: [1, 1, 0.8],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <SymbolView
                  name={{
                    ios: "hand.point.up.left.fill",
                    android: "touch_app",
                  }}
                  size={40}
                  tintColor={theme.colors.text}
                />
              </Animated.View>
            )}
            {step.game.status === "finished" && (
              <VictoryOverlay
                winner={step.game.winner}
                message="あかの かち！"
              />
            )}
          </View>
        </View>
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
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 24,
  },
  demonstration: { gap: 24 },
  instruction: {
    ...theme.typography.bodyLarge,
    color: theme.colors.text,
    textAlign: "center",
    minHeight: 72,
    lineHeight: 36,
  },
  finger: { position: "absolute", left: "37.5%" },
});
