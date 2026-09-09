export const CHESS_FILES = ["a", "b", "c", "d"] as const;
export const CHESS_RANKS = [1, 2, 3, 4, 5] as const;

export type ChessFile = (typeof CHESS_FILES)[number];
export type ChessRank = (typeof CHESS_RANKS)[number];
export type ChessSquare = `${ChessFile}${ChessRank}`;
export type ChessColor = "red" | "blue";
export type ChessPieceType = "warrior" | "queen" | "king" | "wizard";
export type ChessPiece = Readonly<{ color: ChessColor; type: ChessPieceType }>;
export type Chessboard = Readonly<Record<ChessSquare, ChessPiece | null>>;
export type ChessMove = Readonly<{ from: ChessSquare; to: ChessSquare }>;

export type ChessGame = Readonly<
  {
    board: Chessboard;
    moveCount: number;
  } & (
    | { status: "selecting-piece"; turn: ChessColor }
    | {
        status: "selecting-destination";
        turn: ChessColor;
        selectedSquare: ChessSquare;
      }
    | { status: "finished"; winner: ChessColor }
  )
>;

type Direction = Readonly<{ fileOffset: number; rankOffset: number }>;

const orthogonalDirections: readonly Direction[] = [
  { fileOffset: 0, rankOffset: 1 },
  { fileOffset: 0, rankOffset: -1 },
  { fileOffset: -1, rankOffset: 0 },
  { fileOffset: 1, rankOffset: 0 },
];
const diagonalDirections: readonly Direction[] = [
  { fileOffset: -1, rankOffset: 1 },
  { fileOffset: 1, rankOffset: 1 },
  { fileOffset: -1, rankOffset: -1 },
  { fileOffset: 1, rankOffset: -1 },
];
const allDirections = [...orthogonalDirections, ...diagonalDirections];
export const pieceDirections: Readonly<
  Record<ChessPieceType, readonly Direction[]>
> = {
  warrior: orthogonalDirections,
  queen: allDirections,
  king: allDirections,
  wizard: diagonalDirections,
};

export function createChessGame(): ChessGame {
  return {
    status: "selecting-piece",
    turn: "red",
    moveCount: 0,
    board: {
      a1: { color: "red", type: "warrior" },
      b1: { color: "red", type: "queen" },
      c1: { color: "red", type: "king" },
      d1: { color: "red", type: "wizard" },

      a2: null,
      b2: null,
      c2: null,
      d2: null,

      a3: null,
      b3: null,
      c3: null,
      d3: null,

      a4: null,
      b4: null,
      c4: null,
      d4: null,

      a5: { color: "blue", type: "warrior" },
      b5: { color: "blue", type: "queen" },
      c5: { color: "blue", type: "king" },
      d5: { color: "blue", type: "wizard" },
    } satisfies Chessboard,
  };
}

function getAdjacentSquare(
  square: ChessSquare,
  direction: Direction,
): ChessSquare | null {
  const fileIndex = CHESS_FILES.findIndex((file) => file === square[0]);
  const rankIndex = CHESS_RANKS.findIndex((rank) => rank === Number(square[1]));
  const adjacentFile = CHESS_FILES[fileIndex + direction.fileOffset];
  const adjacentRank = CHESS_RANKS[rankIndex + direction.rankOffset];

  if (adjacentFile === undefined || adjacentRank === undefined) return null;

  return `${adjacentFile}${adjacentRank}`;
}

export function getPieceMoves(
  game: ChessGame,
  square: ChessSquare,
): ChessMove[] {
  if (game.status === "finished") return [];

  const piece = game.board[square];
  if (!piece || piece.color !== game.turn) return [];

  const moves: ChessMove[] = [];
  for (const direction of pieceDirections[piece.type]) {
    const to = getAdjacentSquare(square, direction);
    if (to !== null && game.board[to]?.color !== piece.color) {
      moves.push({ from: square, to });
    }
  }
  return moves;
}

export function getSelectedPieceMoves(game: ChessGame): ChessMove[] {
  return game.status === "selecting-destination"
    ? getPieceMoves(game, game.selectedSquare)
    : [];
}

export function movePiece(game: ChessGame, move: ChessMove): ChessGame {
  if (game.status === "finished") return game;

  const piece = game.board[move.from];
  if (
    !piece ||
    !getPieceMoves(game, move.from).some(
      (pieceMove) => pieceMove.to === move.to,
    )
  ) {
    return game;
  }

  const capturedPiece = game.board[move.to];
  const board: Chessboard = {
    ...game.board,
    [move.from]: null,
    [move.to]: piece,
  };
  return capturedPiece?.type === "king"
    ? {
        status: "finished",
        board,
        winner: piece.color,
        moveCount: game.moveCount + 1,
      }
    : {
        status: "selecting-piece",
        board,
        turn: game.turn === "red" ? "blue" : "red",
        moveCount: game.moveCount + 1,
      };
}

export function selectSquare(game: ChessGame, square: ChessSquare): ChessGame {
  switch (game.status) {
    case "selecting-piece": {
      if (game.board[square]?.color !== game.turn) return game;
      return {
        ...game,
        status: "selecting-destination",
        selectedSquare: square,
      };
    }
    case "selecting-destination": {
      if (square === game.selectedSquare) {
        return {
          status: "selecting-piece",
          board: game.board,
          turn: game.turn,
          moveCount: game.moveCount,
        };
      }
      if (game.board[square]?.color === game.turn) {
        return { ...game, selectedSquare: square };
      }
      return movePiece(game, { from: game.selectedSquare, to: square });
    }
    case "finished": {
      return game;
    }
    default: {
      game satisfies never;
      throw new Error("Unreachable");
    }
  }
}
