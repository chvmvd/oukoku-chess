import { Button } from "@/components/button";
import { Chessboard } from "@/components/chessboard";
import { IconButton } from "@/components/icon-button";
import { VictoryOverlay } from "@/components/victory-overlay";
import { theme } from "@/constants/theme";
import {
  createChessGame,
  selectSquare,
  type ChessColor,
  type ChessGame,
  type ChessSquare,
} from "@/game/chess";
import { useNavigation, useRouter } from "expo-router";
import { usePreventRemove } from "expo-router/react-navigation";
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import {
  AccessibilityInfo,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TwoPlayerGameScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [game, setGame] = useState(createChessGame);
  const winner = game.status === "finished" ? game.winner : null;
  const shouldConfirmBeforeDiscardingGame =
    game.moveCount > 0 && game.status !== "finished";

  const announcement =
    game.status === "finished"
      ? `${winner === "red" ? "あか" : "あお"}の勝ち！`
      : `${game.turn === "red" ? "あか" : "あお"}の番`;
  useEffect(() => {
    AccessibilityInfo.announceForAccessibility(announcement);
  }, [announcement]);

  useEffect(() => {
    if (winner !== null) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [winner]);

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
        <PlayerArea playerColor="blue" game={game} />
        <View>
          <Chessboard game={game} onSquarePress={handleSquarePress} />
          {winner !== null && (
            <VictoryOverlay
              winner={winner}
              message={winner === "red" ? "あかの かち！" : "あおの かち！"}
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
          <PlayerArea playerColor="red" game={game} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

type PlayerAreaProps = {
  playerColor: ChessColor;
  game: ChessGame;
};

function PlayerArea({ playerColor, game }: PlayerAreaProps) {
  if (game.status === "finished") return <View style={styles.playerArea} />;

  return (
    <View
      style={[
        styles.playerArea,
        playerColor === "blue" && styles.bluePlayerArea,
      ]}
    >
      <View
        style={[
          styles.turnBadge,
          {
            backgroundColor: theme.colors.players[game.turn].background,
          },
        ]}
      >
        <View
          style={[
            styles.turnColorDot,
            {
              backgroundColor: theme.colors.players[game.turn].primary,
            },
          ]}
        />
        <Text style={styles.turnLabel}>
          {game.turn === playerColor ? "あなたのばん" : "あいてのばん"}
        </Text>
      </View>
      <Text style={styles.movePrompt}>
        {game.turn === playerColor
          ? game.status === "selecting-piece"
            ? "どの こまを うごかす？"
            : "どこに うごかす？"
          : null}
      </Text>
    </View>
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
  playerArea: {
    height: 96,
    gap: 12,
    alignItems: "center",
  },
  bluePlayerArea: { transform: [{ rotate: "180deg" }] },
  turnBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 100,
  },
  turnColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  turnLabel: {
    color: theme.colors.text,
    ...theme.typography.body,
    lineHeight: 28,
  },
  movePrompt: {
    ...theme.typography.body,
    color: theme.colors.text,
    lineHeight: 28,
  },
  buttonGroup: { gap: 8 },
});
