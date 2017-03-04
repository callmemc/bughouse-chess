import chessjs from 'chess.js';
import Immutable, { Map, Iterable } from 'immutable';
import _ from 'lodash-compat';

import Constants from '../constants';
import { emit } from '../socketClient';
import { getPlayer } from '../components/Chessboard/utils';
import { GameStatus, getGameStatus } from '../chessUtils';

const initialState = Immutable.fromJS({
  boards: [],
  players: [{}, {}],      // Players of the game
  userId: undefined,      // If undefined, user is a spectator
  gameId: undefined       // Id of game game being watched
});

export default function game(state = initialState, action) {
  switch (action.type) {
    case Constants.MAKE_MOVE:
      // Don't allow any moves if game is over
      if (isGameOver(state)) {
        console.error('Game is over, move not allowed')
        return state;
      }

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

      if (pieceReserve) {
        state = state.setIn(['boards', pieceReserve.boardNum, 'pieceReserve', pieceReserve.color],
          Immutable.fromJS(pieceReserve.result));
      }
      return state.mergeIn(['boards', boardNum], getUpdatedBoardState(boardNum, fen));

    case Constants.LOAD_GAME:
      const { boards, players, gameId } = action;

      return state.merge(Immutable.fromJS({
        boards: [
          getUpdatedBoardState(0, boards[0].fen, boards[0].pieceReserve),
          getUpdatedBoardState(1, boards[1].fen, boards[1].pieceReserve)
        ],
        players,
        gameId
      }));

    // TODO: move all the user info to a separate reducer?
    case Constants.JOIN_USER:
      return state.set('userId', action.userId);
    case Constants.UPDATE_PLAYERS:
      return state.set('players', Immutable.fromJS(action.players));
    default:
      return state;
  }

  /**
   *  Board state
   *
   *  {
   *    fen: ...,
   *    turn: ...,
   *    status: ...,
   *    pieceReserve: {
   *      w: [...],
   *      b: [...]
   *    }
   *  }
  */
  function getUpdatedBoardState(boardNum, fen, pieceReserve) {
    const chess = new chessjs(fen);

    let result = Map({
      fen: fen,
      turn: chess.turn(),
      status: getGameStatus(chess)
    });

    if (pieceReserve) {
      if (!Iterable.isIterable(pieceReserve)) {
        pieceReserve = Immutable.fromJS(pieceReserve);
      }
      result = result.set('pieceReserve', pieceReserve);
    }

    return result;
  }
}

// Selector
export function isGameOver(state) {
  const boards = state.get('boards');

  if (!boards.get(0) || !boards.get(1)) {
    return false;
  }

  return boards.get(0).get('status') !== GameStatus.IN_PROGRESS ||
    boards.get(1).get('status') !== GameStatus.IN_PROGRESS;
}
