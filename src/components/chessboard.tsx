import { ChessPieceView } from "@/components/chess-piece-view";
import { pieceNames } from "@/constants/pieces";
import { theme } from "@/constants/theme";
import {
  CHESS_FILES,
  CHESS_RANKS,
  getSelectedPieceMoves,
  type ChessGame,
  type ChessSquare,
} from "@/game/chess";
import * as Haptics from "expo-haptics";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";

const squares = CHESS_RANKS.toReversed().flatMap((rank, rowIndex) =>
  CHESS_FILES.map((file, columnIndex) => ({
    square: `${file}${rank}` as const,
    rowIndex,
    columnIndex,
    position: {
      left: `${columnIndex * (100 / CHESS_FILES.length)}%` as const,
      top: `${rowIndex * (100 / CHESS_RANKS.length)}%` as const,
    },
  })),
);

type ChessboardProps = {
  game: ChessGame;
  onSquarePress?: (square: ChessSquare) => void;
  disabled?: boolean;
};

export function Chessboard({
  game,
  onSquarePress,
  disabled = false,
}: ChessboardProps) {
  const selectedSquare =
    game.status === "selecting-destination" ? game.selectedSquare : null;
  const legalDestinations = new Set(
    getSelectedPieceMoves(game).map(({ to }) => to),
  );

  function handleSquarePress(square: ChessSquare) {
    if (!onSquarePress) return;

    if (legalDestinations.has(square)) {
      if (game.board[square]?.type !== "king") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } else {
      Haptics.selectionAsync();
    }
    onSquarePress(square);
  }

  return (
    <View style={styles.board}>
      {squares.map(({ square, rowIndex, columnIndex, position }) => {
        const piece = game.board[square];
        const isSelected = square === selectedSquare;
        const isLegalDestination = legalDestinations.has(square);
        const isSquareDisabled =
          disabled ||
          !onSquarePress ||
          game.status === "finished" ||
          (piece?.color !== game.turn && !isLegalDestination);

        return (
          <Pressable
            key={square}
            accessibilityRole="button"
            accessibilityLabel={`${
              piece
                ? `${piece.color === "red" ? "あか" : "あお"}の${pieceNames[piece.type]}`
                : "空いているマス"
            }。上から${rowIndex + 1}段目、左から${columnIndex + 1}マス目`}
            accessibilityHint={
              isSquareDisabled
                ? undefined
                : isSelected
                  ? "選ぶのをやめる"
                  : isLegalDestination
                    ? piece
                      ? "このコマをつかまえる"
                      : "ここに動かす"
                    : undefined
            }
            accessibilityState={{
              selected: isSelected,
              disabled: isSquareDisabled,
            }}
            accessible={piece !== null || isLegalDestination}
            disabled={isSquareDisabled}
            onPress={() => handleSquarePress(square)}
            style={[
              styles.square,
              position,
              (rowIndex + columnIndex) % 2 === 0
                ? styles.lightSquare
                : styles.darkSquare,
              isSelected && styles.selectedSquare,
            ]}
          />
        );
      })}
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
      >
        {squares.map(({ square, position }) => {
          const piece = game.board[square];
          if (!piece) return null;

          return (
            <Animated.View
              key={`${piece.color}-${piece.type}`}
              layout={
                Platform.OS === "ios" && game.moveCount > 0
                  ? LinearTransition.duration(180)
                  : undefined
              }
              exiting={FadeOut.duration(160)}
              style={[
                styles.piece,
                position,
                square === selectedSquare && styles.selectedPiece,
              ]}
            >
              <ChessPieceView chessPiece={piece} />
            </Animated.View>
          );
        })}
        {squares.map(
          ({ square, position }) =>
            legalDestinations.has(square) && (
              <Animated.View
                key={`${selectedSquare}-${square}`}
                entering={FadeIn.duration(100)}
                style={[styles.moveMarkerContainer, position]}
              >
                <View
                  style={[
                    styles.moveMarker,
                    game.board[square] !== null && styles.captureMarker,
                  ]}
                />
              </Animated.View>
            ),
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    width: "100%",
    aspectRatio: CHESS_FILES.length / CHESS_RANKS.length,
  },
  square: {
    position: "absolute",
    width: `${100 / CHESS_FILES.length}%`,
    height: `${100 / CHESS_RANKS.length}%`,
  },
  lightSquare: {
    backgroundColor: theme.colors.board.lightSquare,
  },
  darkSquare: {
    backgroundColor: theme.colors.board.darkSquare,
  },
  selectedSquare: {
    backgroundColor: theme.colors.board.selectedSquare,
  },
  piece: {
    position: "absolute",
    width: `${100 / CHESS_FILES.length}%`,
    height: `${100 / CHESS_RANKS.length}%`,
    padding: 2,
  },
  selectedPiece: {
    padding: 6,
  },
  moveMarkerContainer: {
    position: "absolute",
    width: `${100 / CHESS_FILES.length}%`,
    height: `${100 / CHESS_RANKS.length}%`,
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
  },
  moveMarker: {
    position: "absolute",
    width: "60%",
    aspectRatio: 1,
    borderRadius: 4,
    backgroundColor: theme.colors.board.legalDestination,
  },
  captureMarker: {
    opacity: 0.9,
  },
});
