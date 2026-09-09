import { pieceImages } from "@/constants/pieces";
import { theme } from "@/constants/theme";
import { pieceDirections, type ChessPiece } from "@/game/chess";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

type ChessPieceViewProps = {
  chessPiece: ChessPiece;
};

export function ChessPieceView({ chessPiece }: ChessPieceViewProps) {
  return (
    <View style={[styles.piece, chessPiece.color === "blue" && styles.bluePiece]}>
      <Image
        source={pieceImages[chessPiece.color][chessPiece.type]}
        style={styles.pieceImage}
        contentFit="contain"
        accessible={false}
      />
      <View accessible={false} style={styles.directionMarkers}>
        {pieceDirections[chessPiece.type].map(({ fileOffset, rankOffset }) => (
          <Image
            key={`${fileOffset},${rankOffset}`}
            source={require("@/assets/images/pieces/move-direction.svg")}
            tintColor={theme.colors.players[chessPiece.color].primary}
            accessible={false}
            style={[
              styles.directionMarker,
              {
                left: `${(fileOffset + 1) * 50}%`,
                top: `${(1 - rankOffset) * 50}%`,
                transform: [
                  {
                    rotate: `${Math.atan2(fileOffset, rankOffset)}rad`,
                  },
                ],
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  piece: {
    width: "100%",
    height: "100%",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.players.red.primary,
    backgroundColor: theme.colors.players.red.background,
  },
  bluePiece: {
    borderColor: theme.colors.players.blue.primary,
    backgroundColor: theme.colors.players.blue.background,
    transform: [{ rotate: "180deg" }],
  },
  pieceImage: {
    width: "100%",
    height: "100%",
  },
  directionMarkers: {
    position: "absolute",
    inset: 6,
  },
  directionMarker: {
    position: "absolute",
    width: 8,
    height: 6,
    marginLeft: -4,
    marginTop: -3,
  },
});
