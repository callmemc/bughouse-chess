/* Enum Types for Game Status */
export const GameStatus = {
  CHECKMATE: Symbol('CHECKMATE'),
  DRAW: Symbol('DRAW'),
  STALEMATE: Symbol('STALEMATE'),
  THREEFOLD_REPETITION: Symbol('THREEFOLD_REPETITION'),
  INSUFFICIENT_MATERIAL: Symbol('INSUFFICIENT_MATERIAL'),
  IN_PROGRESS: Symbol('IN_PROGRESS')    // TODO: better naming
}

export function getGameStatus(chess) {
  if (chess.in_checkmate()) {
    return GameStatus.CHECKMATE;
  // TODO: in_stalemate is returning true when it shouldn't be
  // } else if (chess.in_draw()) {
  //   return GameStatus.DRAW;
  // } else if (chess.in_stalemate()) {
  //   return GameStatus.STALEMATE;
  // } else if (chess.in_threefold_repetition()) {
  //   return GameStatus.THREEFOLD_REPETITION;
  // } else if (chess.insufficient_material()) {
  //   return GameStatus.CHECKMATE;
  } else {
    return GameStatus.IN_PROGRESS;
  }
}
