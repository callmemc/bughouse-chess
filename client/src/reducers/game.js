import chessjs from 'chess.js';
import Immutable from 'immutable';
import _ from 'lodash-compat';

import Constants from '../constants';
import { emit } from '../socketClient';
import { getPlayer } from '../components/Chessboard/utils';

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
      // in_check ?
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
  players: [{}, {}],      // Players of the game     
  gameStatus: undefined,   // game over: checkmate, draw, stalemate, threefold repetition
  userId: undefined,    // If undefined, user is a spectator
  gameId: undefined    // Id of game game being watched
});

export default function game(state = initialState, action) {
  // const board = state.getIn(['user', 'board']);   // TODO

  switch (action.type) {
    // TODO: do these really need to be actions?
    case Constants.MAKE_MOVE:  
      const user = getPlayer(state.get('userId'), state.get('players'));

      emit('move', {
        ..._.pick(action, 'fromSquare', 'toSquare', 'color', 'piece'),
        boardNum: user.board,
        gameId: state.get('gameId')
      });          
      return state;  

    // TODO: does this really need to be under a flux action?
    case Constants.CREATE_GAME:
      emit('create game');
      // Route the user back with game id;
      return state;
    case Constants.UPDATE_GAME:
      const { boardNum, fen, pieceReserve } = action;

      // TODO: make sure chessjs object is in memory
      chessArray[boardNum].load(fen);

      if (pieceReserve) {
        state = state.setIn(['boards', pieceReserve.boardNum, 'pieceReserve', pieceReserve.color], 
          Immutable.fromJS(pieceReserve.result));
      }
      return state.mergeIn(['boards', boardNum], getUpdatedBoardState(boardNum, fen));

    case Constants.LOAD_GAME:
      const { boards, players, gameId } = action;
      chessArray[0].load(boards[0].fen);
      chessArray[1].load(boards[1].fen);

      // TODO: this should be just 1 immutable call
      state = state.mergeIn(['boards', 0], getUpdatedBoardState(0, boards[0].fen));
      state = state.setIn(['boards', 0, 'pieceReserve'], Immutable.fromJS(boards[0].pieceReserve));
      state = state.mergeIn(['boards', 1], getUpdatedBoardState(1, boards[1].fen));
      state = state.setIn(['boards', 1, 'pieceReserve'], Immutable.fromJS(boards[1].pieceReserve));
      state = state.set('players', Immutable.fromJS(players));
      state = state.set('gameId', gameId);
      console.log(gameId + ' loaded');

      return state;

    // TODO: move all the user info to a separate reducer?
    case Constants.JOIN_USER:
      return state.set('userId', action.userId);
    case Constants.UPDATE_PLAYERS:
      return state.set('players', Immutable.fromJS(action.players));
    default:
      return state;
  }

  function getUpdatedBoardState(boardNum, fen) {
    const boardChess = chessArray[boardNum];
    return Immutable.Map({
      fen: fen,
      turn: boardChess.turn()
    });
  }
}
