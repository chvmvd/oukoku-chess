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
import { Pressable, StyleSheet, View } from "react-native";

type ChessboardProps = {
  game: ChessGame;
  onSquarePress: (square: ChessSquare) => void;
};

export function Chessboard({ game, onSquarePress }: ChessboardProps) {
  const selectedSquare =
    game.status === "selecting-destination" ? game.selectedSquare : null;
  const selectedPieceMoves = getSelectedPieceMoves(game);

  return (
    <View style={styles.board}>
      {CHESS_RANKS.toReversed().map((rank, rowIndex) => (
        <View key={rank} style={styles.row}>
          {CHESS_FILES.map((file, columnIndex) => {
            const square: ChessSquare = `${file}${rank}`;
            const piece = game.board[square];
            const isSelected = square === selectedSquare;
            const isLegalDestination = selectedPieceMoves.some(
              (move) => move.to === square,
            );
            const isDisabled =
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
                  isDisabled
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
                  disabled: isDisabled,
                }}
                accessible={piece !== null || isLegalDestination}
                disabled={isDisabled}
                onPress={() => onSquarePress(square)}
                style={[
                  styles.square,
                  (rowIndex + columnIndex) % 2 === 1 && styles.darkSquare,
                  isSelected && styles.selectedSquare,
                ]}
              >
                {piece && <ChessPieceView chessPiece={piece} />}
                {isLegalDestination && (
                  <View
                    style={[
                      styles.destinationMarker,
                      piece !== null && styles.captureMarker,
                    ]}
                  />
                )}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
  },
  square: {
    flex: 1,
    aspectRatio: 1,
    padding: 2,
    backgroundColor: theme.colors.board.lightSquare,
    alignItems: "center",
    justifyContent: "center",
  },
  darkSquare: {
    backgroundColor: theme.colors.board.darkSquare,
  },
  selectedSquare: {
    backgroundColor: theme.colors.board.selectedSquare,
  },
  destinationMarker: {
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
