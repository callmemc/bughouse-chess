import _ from 'lodash-compat';
import chessjs from 'chess.js';
const chess = chessjs();

const ChessPieces = {
  // key: piece from FEN, value: piece from Smart Regular chess font
  // white pieces
  'K': 'F',
  'Q': 'E',
  'R': 'D',
  'B': 'C',
  'N': 'B',
  'P': 'A',
  // black pieces
  'k': 'f',
  'q': 'e',
  'r': 'd',
  'b': 'c',
  'n': 'b',
  'p': 'a',
  // empty square
  '-': undefined
};

export function getSmartFontPiece(fenPiece) {
  return ChessPieces[fenPiece];
}

export function getChessJsPiece(piece, color) {
  return color === chess.WHITE ? piece.toUpperCase() : piece;
}

export function getPieceColor(piece) {
  return piece === piece.toUpperCase() ? chess.WHITE : chess.BLACK;
}

// TODO: remove in favor of chess game
export function getPieces2DArray(fen) {
  const rankArray = fen.split(' ')[0].split('/');

  return _.map(rankArray.reverse(), (rank) =>
    rank.replace(/\d/g, count => _.repeat('-', Number(count)))
      .split('')
  );
}

export function getOpposingColor(color) {
  return color === chess.WHITE ? chess.BLACK : chess.WHITE;
}

export function getOtherBoard(board) {
  return board === 1 ? 0 : 1;
}

export function getTeam(board, color) {
  if ((board === 0 && color === chess.WHITE) || (board === 1 && color === chess.BLACK)) {
    return 1;
  } else if ((board === 0 && color === chess.BLACK) || (board === 1 && color === chess.WHITE)) {
    return 2;
  } else {
    return undefined;
  }
}

export function getPlayer(userId, players) {
  const playerOptions = [
    {board: 0, color: chess.WHITE},
    {board: 0, color: chess.BLACK},
    {board: 1, color: chess.WHITE},
    {board: 1, color: chess.BLACK}
  ];

  return playerOptions.find(({ board, color }) =>
    players.getIn([board, color]) === userId
  );
}

// TODO: find a better way to do this...
export const COLUMN_MAP = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: 5,
  f: 6,
  g: 7,
  h: 8
};

function isPawn(piece) {
  return piece.toLowerCase() === chess.PAWN;
}

/**
 *  Disallow dropping of pawn on the first or last rank
 */
export function isValidDrop(piece, rank) {
  return !(isPawn(piece) && (rank === 1 || rank === 8));
}
