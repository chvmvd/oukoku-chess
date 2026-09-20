import type { ChessColor, ChessPieceType } from "@/game/chess";
import type { ImageSource } from "expo-image";

export const pieceNames: Record<ChessPieceType, string> = {
  warrior: "せんし",
  queen: "じょおうさま",
  king: "おうさま",
  wizard: "まほうつかい",
};

export const pieceImages: Record<
  ChessColor,
  Record<ChessPieceType, ImageSource>
> = {
  red: {
    warrior: require("@/assets/images/pieces/red-warrior-piece.svg"),
    queen: require("@/assets/images/pieces/red-queen-piece.svg"),
    king: require("@/assets/images/pieces/red-king-piece.svg"),
    wizard: require("@/assets/images/pieces/red-wizard-piece.svg"),
  },
  blue: {
    warrior: require("@/assets/images/pieces/blue-warrior-piece.svg"),
    queen: require("@/assets/images/pieces/blue-queen-piece.svg"),
    king: require("@/assets/images/pieces/blue-king-piece.svg"),
    wizard: require("@/assets/images/pieces/blue-wizard-piece.svg"),
  },
};
