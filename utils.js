export function getOpposingColor(color) {
  return color === 'w' ? 'b' : 'w';
}

export function getOtherBoard(board) {
  return board === 1 ? 0 : 1;
}

export function getChessJsPiece(piece, color) {
  return color === 'w' ? piece.toUpperCase() : piece;
}

export const playerOptions = [
  {board: 0, color: 'w'},
  {board: 0, color: 'b'},
  {board: 1, color: 'w'},
  {board: 1, color: 'b'}
];