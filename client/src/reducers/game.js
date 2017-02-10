import chessjs from 'chess.js';
import Immutable from 'immutable';
import io from 'socket.io-client';

import Constants from '../constants';
import { getOpposingColor, getOtherBoard, getChessJsPiece } 
  from '../components/Chessboard/utils';
import store from '../store';
import { joinGame, updateGame } from '../actions/game';

// chessjs instance objects
const chessArray = [
  new chessjs(),
  new chessjs()
];

// TODO: this will probably be sent with database
const initialState = Immutable.fromJS({
  boards: [
    {
      fen: chessArray[0].fen(),  
      pieceReserve: {
        w: [],
        b: []
      },
      turn: chessArray[0].turn(), 
    },
    {
      fen: chessArray[1].fen(),  
      pieceReserve: {
        w: [],
        b: []
      },
      turn: chessArray[1].turn(), 
    }
  ],
  user: undefined         // If undefined, user is a spectator
});

// TODO: Move this under a JOIN action
// https://exec64.co.uk/blog/websockets_with_redux/
const socket = io();

socket.on('join game', (data) => {
  store.dispatch(joinGame(data));
});

socket.on('update game', (data) => {
  store.dispatch(updateGame(data));
});

// Send move to server
function makeMove({board, fen, pieceReserveBoard, pieceReserve, pieceReserveColor}) {
  socket.emit('move', {
    board,
    fen,
    pieceReserveBoard, 
    pieceReserveColor,
    pieceReserve: pieceReserve ? pieceReserve.toJS() : undefined
  });  
}

export default function game(state = initialState, action) {
  const { fromSquare, toSquare, color, piece } = action;
  const board = state.getIn(['user', 'board']);
  const otherBoard = getOtherBoard(board);
  const chess = chessArray[board];  // The user's chess instance
  let updatedPieceReserveBoard, updatedPieceReserveColor, updatedPieceReserve, moveResult;

  switch (action.type) {
    case Constants.DROP_MOVE: 
      // If the piece dropped is not the current turn's color, return
      // TODO: check if the piece dropped is valid-- not last/first row && not on top of other piece
      if (color !== chess.turn()) {
        return state;
      }

      moveResult = chess.put({ type: piece, color }, toSquare);
      if (moveResult) {
        
        // Remove piece from reserve
        const pieceIndex = state.getIn(['boards', board, 'pieceReserve', color]).findIndex(p => p === piece);
        updatedPieceReserve = state.getIn(['boards', board, 'pieceReserve', color])
            .delete(pieceIndex);
        updatedPieceReserveBoard = board;
        updatedPieceReserveColor = color;

        // Force next turn
        // TODO: move this to chess object?
        const tokens = chess.fen().split(' ');
        tokens[1] = (tokens[1] === 'w') ? 'b' : 'w';
        chess.load(tokens.join(' '));

        makeMove({
          board, 
          fen: chess.fen(), 
          pieceReserve: updatedPieceReserve,
          pieceReserveBoard: updatedPieceReserveBoard, 
          pieceReserveColor: updatedPieceReserveColor
        });        
      }  
      return state;
    case Constants.MAKE_MOVE:            
      // Standard move
      moveResult = chess.move({ from: fromSquare, to: toSquare });

      if (moveResult) {   // chess.move() returns null if move was invalid
        const { captured, color } = moveResult;

        if (captured) {
          // Add piece to partner's reserve
          const reservePieceColor = getOpposingColor(color);
          const reservePiece = getChessJsPiece(captured, reservePieceColor);
          updatedPieceReserve = state.getIn(['boards', otherBoard, 'pieceReserve', reservePieceColor])
            .push(reservePiece);  
          updatedPieceReserveBoard = otherBoard;
          updatedPieceReserveColor = reservePieceColor;          
        }

        makeMove({
          board, 
          fen: chess.fen(), 
          pieceReserve: updatedPieceReserve,
          pieceReserveBoard: updatedPieceReserveBoard,
          pieceReserveColor: updatedPieceReserveColor
        });
      }
      
      return state;
    case Constants.JOIN_GAME:
      console.log('JOIN GAME as', action.board, action.color);
      return state.set('user', Immutable.Map({
        board: action.board,
        color: action.color
      }));
    case Constants.UPDATE_GAME:
      console.log('update game', action);
      chessArray[action.board].load(action.fen);

      if (action.pieceReserve) {
        state = state.setIn(['boards', action.pieceReserveBoard, 'pieceReserve', action.pieceReserveColor], 
          Immutable.fromJS(action.pieceReserve));
      }
      return state.mergeIn(['boards', action.board], getUpdatedGameState(action.board));
    default:
      return state;
  }

  function getUpdatedGameState(board) {
    const boardChess = chessArray[board];
    return Immutable.Map({
      fen: boardChess.fen(),
      turn: boardChess.turn()
    });
  }
}
