import chessjs from 'chess.js';
import Immutable from 'immutable';
import io from 'socket.io-client';

import Constants from '../constants';
import { getOpposingColor, getChessJsPiece } from '../components/Chessboard/utils';
import store from '../store';
import { joinGame, updateGame } from '../actions/game';

const chess = new chessjs();    // chessjs instance object

// TODO: this will probably be sent with database
const initialState = Immutable.fromJS({
  fen: chess.fen(),  
  pieceReserve: {
    w: [],
    b: []
  },
  turn: chess.turn(),
  userColor: undefined    // If undefined, user is a spectator
});

// TODO: Move this under a JOIN action
// https://exec64.co.uk/blog/websockets_with_redux/

const socket = io();

socket.on('join game', (userColor) => {
  console.log('socket join game', userColor);
  store.dispatch(joinGame(userColor));
});

socket.on('update game', (data) => {
  store.dispatch(updateGame(data));
});

// Send move to server
function makeMove(pieceReserve) {
  socket.emit('move', {
    fen: chess.fen(),
    pieceReserve: pieceReserve.toJS()
  });  
}



export default function game(state = initialState, action) {
  const { fromSquare, toSquare, color, piece } = action;

  switch (action.type) {    
    case Constants.MAKE_MOVE:      
      // Standard move
      if (fromSquare) {        
        const moveResult = chess.move({ from: fromSquare, to: toSquare });

        if (moveResult) {   // chess.move() returns null if move was invalid
          const { captured, color } = moveResult;

          if (captured) {
            // Add piece to reserve (TODO: opponent's reserve)
            const reservePieceColor = getOpposingColor(color);
            const reservePiece = getChessJsPiece(captured, reservePieceColor);
            state = state.updateIn(['pieceReserve', getOpposingColor(color)], 
              list => list.push(reservePiece));

            console.log(state.get('pieceReserve').toJS());
          }
        }
      // Drop move
      } else {
        // If the piece dropped is not the current turn's color, return
        // TODO: check if the piece dropped is valid-- not last/first row && not on top of other piece
        if (color !== chess.turn()) {
          return state;
        }

        const moveResult = chess.put({ type: piece, color }, toSquare);
        if (moveResult) {
          
          // Remove piece from reserve
          const pieceIndex = state.getIn(['pieceReserve', color]).findIndex(p => p === piece);
          state = state.updateIn(['pieceReserve', color], 
              list => list.delete(pieceIndex));

          // Force next turn
          // TODO: move this to chess object?
          const tokens = chess.fen().split(' ');
          tokens[1] = (tokens[1] === 'w') ? 'b' : 'w';
          chess.load(tokens.join(' '));
        }        
      }

      state = state.merge(getUpdatedGameState());

      makeMove(state.get('pieceReserve'));

      return state;
    case Constants.JOIN_GAME:
      console.log('JOIN GAME as', action.userColor);
      return state.set('userColor', action.userColor);
    case Constants.UPDATE_GAME:
      chess.load(action.fen);
      state = state.set('pieceReserve', Immutable.fromJS(action.pieceReserve));
      return state.merge(getUpdatedGameState());
    default:
      return state;
  }
}

function getUpdatedGameState() {
  return Immutable.Map({
    fen: chess.fen(),
    turn: chess.turn()
  });
}
