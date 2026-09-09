import {
  CHESS_FILES,
  CHESS_RANKS,
  getPieceMoves,
  movePiece,
  type ChessGame,
  type ChessMove,
  type ChessPieceType,
  type ChessSquare,
} from "./chess";

type ComputerDifficulty = "easy" | "normal" | "hard";

const pieceValues: Record<ChessPieceType, number> = {
  warrior: 5,
  queen: 9,
  king: 100,
  wizard: 3,
};

function getAvailableMoves(game: ChessGame): ChessMove[] {
  if (game.status !== "selecting-piece") return [];

  const moves: ChessMove[] = [];
  for (const file of CHESS_FILES) {
    for (const rank of CHESS_RANKS) {
      const square: ChessSquare = `${file}${rank}`;
      if (game.board[square]?.color !== game.turn) continue;
      moves.push(...getPieceMoves(game, square));
    }
  }
  return moves;
}

function evaluatePosition(game: ChessGame): number {
  if (game.status === "finished") return game.winner === "blue" ? 1000 : -1000;

  return Object.values(game.board).reduce((score, piece) => {
    if (!piece) return score;
    const pieceValue = pieceValues[piece.type];
    return score + (piece.color === "blue" ? pieceValue : -pieceValue);
  }, 0);
}

function evaluateMove(
  game: ChessGame,
  move: ChessMove,
  difficulty: ComputerDifficulty,
): number {
  if (game.board[move.to]?.type === "king") return Infinity;

  switch (difficulty) {
    case "easy":
      return 0;
    case "normal":
      return game.board[move.to] ? 1 : 0;
    case "hard": {
      const nextGame = movePiece(game, move);
      const replies = getAvailableMoves(nextGame);
      if (replies.length === 0) return evaluatePosition(nextGame);

      return Math.min(
        ...replies.map((reply) => evaluatePosition(movePiece(nextGame, reply))),
      );
    }
  }
}

export function playComputerTurn(
  game: ChessGame,
  difficulty: ComputerDifficulty,
): ChessGame {
  if (game.status !== "selecting-piece" || game.turn !== "blue") return game;

  const availableMoves = getAvailableMoves(game);
  if (availableMoves.length === 0) return game;
  const scoredMoves = availableMoves.map((move) => ({
    move,
    score: evaluateMove(game, move, difficulty),
  }));
  const bestScore = Math.max(...scoredMoves.map(({ score }) => score));
  const bestMoves = scoredMoves
    .filter(({ score }) => score === bestScore)
    .map(({ move }) => move);
  const move = bestMoves[Math.floor(Math.random() * bestMoves.length)];

  return move ? movePiece(game, move) : game;
}
