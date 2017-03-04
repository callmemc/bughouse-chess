import chessjs from '../chess.js';

import * as redisClient from '../redisClient';
import { getOpposingColor, getOtherBoard, getChessJsPiece } from '../utils';

export function makeMove({ boardNum, fromSquare, toSquare, color, piece, gameId }, cb) {
  redisClient.getGame(gameId)
    .then(result => {
      let moveResult, pieceReserveResult;
      const { boards, players } = result;
      // Create new chess instance loaded from fen
      const chess = new chessjs.Chess(boards[boardNum].fen);

      if (!fromSquare) {
        dropMove();
      } else {
        normalMove();
      }

      if (moveResult) {
        const fen = chess.fen();

        // Write updated game back to redis
        redisClient.updateGame(gameId, boardNum, fen, pieceReserveResult)
          .then((result) => {
            // TODO?
          });

        cb(boardNum, fen, pieceReserveResult);
      }

      function dropMove() {
        // If the piece dropped is not the current turn's color, return
        if (color !== chess.turn()) {
          return;
        }

        moveResult = chess.put({ type: piece, color }, toSquare);
        if (moveResult) {
          // Remove dropped piece from reserve
          const pieceReserve = boards[boardNum].pieceReserve[color];
          const droppedPieceIndex = pieceReserve.indexOf(piece);
          pieceReserve.splice(droppedPieceIndex, 1);
          // TODO: To make this simpler, should I just be passing around entire pieceReserve?
          pieceReserveResult = { boardNum, color, result: pieceReserve };

          advanceTurn(chess);
        }
      }

      function normalMove() {
        moveResult = chess.move({ from: fromSquare, to: toSquare });
        if (moveResult) {   // chess.move() returns null if move was invalid
          const { captured, color } = moveResult;

          if (captured) {
            // Add piece to partner's reserve
            const reservePieceColor = getOpposingColor(color);
            const reservePiece = getChessJsPiece(captured, reservePieceColor);

            // Add taken piece to partner's reserve
            const otherBoard = getOtherBoard(boardNum);
            const pieceReserve = boards[otherBoard].pieceReserve[reservePieceColor];
            pieceReserve.push(reservePiece);

            pieceReserveResult = {
              boardNum: otherBoard,
              color: reservePieceColor,
              result: pieceReserve
            }
          }
        }
      }
    });
}

// Advance turn by modifying and loading fen
function advanceTurn(chess) {
  const tokens = chess.fen().split(' ');
  tokens[1] = (tokens[1] === 'w') ? 'b' : 'w';

  // Passing in 'force' option to force the load of positions that are invalid
  //  in a normal game of chess, but are valid in bughouse (e.g. 9 pawns)
  chess.load(tokens.join(' '), {force: true});
}