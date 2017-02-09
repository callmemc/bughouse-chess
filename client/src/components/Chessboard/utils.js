import _ from 'lodash-compat';

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

// TODO: remove in favor of chess game
export function getPieces2DArray(fen) {
  const rankArray = fen.split(' ')[0].split('/');

  return _.map(rankArray.reverse(), (rank) =>
    rank.replace(/\d/g, count => _.repeat('-', Number(count)))
      .split('')
  );
}

export function getOpposingColor(color) {
  return color === 'w' ? 'b' : 'w';
}

export function getChessJsPiece(piece, color) {
  return color === 'w' ? piece.toUpperCase() : piece;
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