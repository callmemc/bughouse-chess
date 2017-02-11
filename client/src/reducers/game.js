import chessjs from 'chess.js';
import Immutable from 'immutable';

import Constants from '../constants';
import { getOpposingColor, getOtherBoard, getChessJsPiece } 
  from '../components/Chessboard/utils';
import socket from '../socket';

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
  user: undefined,    // If undefined, user is a spectator
  players: [{}, {}]         // Players of the game     
});


// Send move to socket server so that it can be broadcasted to other users
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

    // TODO: Should all the logic go from MAKE_MOVE/DROP_MOVE into UPDATE_GAME? Therefore
    //  we're not passing around the fen, which is unreliable and can get out of sync
    //   Instead, we're only emitting and broadcasting moves, and it's the client's job
    //   to update their chess.js object and therefore the fen?
    //  Later, the server should store the fen?
    //  Why not store the chessjs object in memory?
    case Constants.UPDATE_GAME:
      console.log('update game', action);
      chessArray[action.board].load(action.fen);

      if (action.pieceReserve) {
        state = state.setIn(['boards', action.pieceReserveBoard, 'pieceReserve', action.pieceReserveColor], 
          Immutable.fromJS(action.pieceReserve));
      }
      return state.mergeIn(['boards', action.board], getUpdatedGameState(action.board));

    // TODO: move all the user info to a separate reducer?
    case Constants.JOIN_USER:
      console.log('JOIN USER as', action.board, action.color);
      return state.set('user', Immutable.Map({
        board: action.board,
        color: action.color
      }));

    case Constants.UPDATE_PLAYERS:
      return state.set('players', Immutable.fromJS(action.players));
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
