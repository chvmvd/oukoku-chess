import { Button } from "@/components/button";
import { Chessboard } from "@/components/chessboard";
import { IconButton } from "@/components/icon-button";
import { Stars } from "@/components/stars";
import { VictoryOverlay } from "@/components/victory-overlay";
import { pieceImages } from "@/constants/pieces";
import { theme } from "@/constants/theme";
import { createChessGame, selectSquare, type ChessSquare } from "@/game/chess";
import { playComputerTurn } from "@/game/computer-player";
import { Image } from "expo-image";
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import { usePreventRemove } from "expo-router/react-navigation";
import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useState } from "react";
import {
  AccessibilityInfo,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SinglePlayerGameScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { difficulty: difficultyParam } = useLocalSearchParams<{
    difficulty?: string;
  }>();
  const difficulty =
    difficultyParam === "easy" || difficultyParam === "hard"
      ? difficultyParam
      : "normal";
  const [game, setGame] = useState(createChessGame);
  const winner = game.status === "finished" ? game.winner : null;
  const shouldConfirmBeforeDiscardingGame =
    game.moveCount > 0 && game.status !== "finished";

  const announcement =
    game.status === "finished"
      ? `${winner === "red" ? "あなた" : "あいて"}の勝ち！`
      : `${game.turn === "red" ? "あなた" : "あいて"}の番`;
  useEffect(() => {
    AccessibilityInfo.announceForAccessibility(announcement);
  }, [announcement]);

  useEffect(() => {
    if (winner !== null) {
      Haptics.notificationAsync(
        winner === "red"
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Warning,
      );
    }
  }, [winner]);

  const isComputerTurn = game.status !== "finished" && game.turn === "blue";

  useFocusEffect(
    useCallback(() => {
      if (!isComputerTurn) return;

      const timeout = setTimeout(() => {
        setGame(playComputerTurn(game, difficulty));
      }, 700);

      return () => clearTimeout(timeout);
    }, [game, isComputerTurn, difficulty, setGame]),
  );

  usePreventRemove(shouldConfirmBeforeDiscardingGame, ({ data }) => {
    Alert.alert("もどる？", "いまの ゲームは おわりになるよ。", [
      { text: "つづける", style: "cancel" },
      {
        text: "もどる",
        style: "destructive",
        onPress: () => navigation.dispatch(data.action),
      },
    ]);
  });

  function handleRestartPress() {
    if (!shouldConfirmBeforeDiscardingGame) {
      setGame(createChessGame());
      return;
    }

    Alert.alert("はじめから やりなおす？", "いまの ゲームは おわりになるよ。", [
      { text: "つづける", style: "cancel" },
      {
        text: "やりなおす",
        style: "destructive",
        onPress: () => setGame(createChessGame()),
      },
    ]);
  }

  function handleSquarePress(square: ChessSquare) {
    setGame((currentGame) => selectSquare(currentGame, square));
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <IconButton
          label="戻る"
          icon={{ ios: "chevron.left", android: "arrow_back" }}
          onPress={() => router.back()}
        />
        <IconButton
          label="初めからやり直す"
          icon={{ ios: "arrow.counterclockwise", android: "restart_alt" }}
          onPress={handleRestartPress}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.computerPlayer}>
          <Image
            source={pieceImages.blue.king}
            style={styles.computerKingImage}
            accessible={false}
          />
          <View style={styles.computerDifficulty}>
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
        </View>
        <View>
          <Chessboard
            game={game}
            onSquarePress={handleSquarePress}
            disabled={isComputerTurn}
          />
          {winner !== null && (
            <VictoryOverlay
              winner={winner}
              message={winner === "red" ? "あなたの かち！" : "あいての かち！"}
            />
          )}
        </View>
        {winner !== null ? (
          <View style={styles.buttonGroup}>
            <Button
              label="もういっかい"
              icon={{ ios: "arrow.counterclockwise", android: "restart_alt" }}
              variant="filled"
              onPress={handleRestartPress}
            />
            <Button
              label="おわる"
              icon={{ ios: "house", android: "home" }}
              variant="outlined"
              onPress={() => router.dismissTo("/")}
            />
          </View>
        ) : (
          <Text style={styles.movePrompt}>
            {isComputerTurn
              ? "あいてが かんがえているよ"
              : game.status === "selecting-piece"
                ? "どの こまを うごかす？"
                : "どこに うごかす？"}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  content: {
    paddingHorizontal: 32,
    paddingVertical: 8,
    gap: 12,
  },
  computerPlayer: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: theme.colors.players.blue.background,
  },
  computerKingImage: { width: 60, height: 60 },
  computerDifficulty: {
    gap: 6,
  },
  difficultyLabel: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  movePrompt: {
    ...theme.typography.body,
    color: theme.colors.text,
    lineHeight: 28,
    textAlign: "center",
  },
  buttonGroup: { gap: 8 },
});
