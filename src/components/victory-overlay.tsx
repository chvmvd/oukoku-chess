import { pieceImages } from "@/constants/pieces";
import { theme } from "@/constants/theme";
import type { ChessColor } from "@/game/chess";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

type VictoryOverlayProps = {
  winner: ChessColor;
  message: string;
};

export function VictoryOverlay({ winner, message }: VictoryOverlayProps) {
  return (
    <View style={styles.overlay}>
      <View style={styles.banner}>
        <Image
          source={pieceImages[winner].king}
          style={styles.winnerKingImage}
          accessible={false}
        />
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          style={[
            styles.message,
            {
              color: theme.colors.players[winner].primary,
            },
          ]}
        >
          {message}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
  },
  banner: {
    backgroundColor: theme.colors.background,
    opacity: 0.9,
    paddingVertical: 40,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  winnerKingImage: { width: 60, height: 60 },
  message: {
    flexShrink: 1,
    ...theme.typography.headline,
  },
});
