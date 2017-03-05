import chessjs from 'chess.js';
import Immutable, { Map, Iterable } from 'immutable';
import _ from 'lodash-compat';

import Constants from '../constants';
import { emit } from '../socketClient';
import { getPlayer/*, isPromotion*/ } from '../components/Chessboard/utils';
import { GameStatus, getGameStatus } from '../chessUtils';

const initialState = Immutable.fromJS({
  boards: [],
  players: [{}, {}],          // Players of the game
  userId: undefined,          // If undefined, user is a spectator
  gameId: undefined,          // Id of game game being watched
  activeSquare: undefined,    // Square for piece currently being dragged
  moves: undefined,           // Also possible moves based on activeSquare
  activeTarget: undefined     // Promotion is active
});

export default function game(state = initialState, action) {
  let user;
  switch (action.type) {
    case Constants.BEGIN_DRAG:
      const { square } = action;
      user = getUser(state);

      // TODO: selector for fen, or store chessjs in memory
      const chess = new chessjs(state.getIn(['boards', user.board, 'fen']));
      const moves = chess.moves({ verbose: true, square });

      state = state.merge({
        activeSquare: square,
        moves: Immutable.fromJS(moves)
      });
      return state;

    case Constants.END_DRAG:
      if (state.get('activeTarget')) {
        return state;
      } else {
        return state.delete('activeSquare').delete('moves');
      }

    case Constants.MAKE_MOVE:
      // Don't allow any moves if game is over
      if (isGameOver(state)) {
        console.error('Game is over, move not allowed')
        return state;
      } else if (isPromotion(action.fromSquare, action.toSquare, state) &&
        !action.promotion) {
        return state.set('activeTarget', action.toSquare);
      } else {
        let move;
        if (action.promotion) {
          // TODO: promoted piece needs to be indicated specially so that
          //  capturing it reverts back to a pawn
          move = {
            promotion: action.promotion,
            fromSquare: state.get('activeSquare'),
            toSquare: state.get('activeTarget')
          };
          state = state.delete('activeSquare').delete('moves')
            .delete('activeTarget');
        } else {
          move = _.pick(action, 'fromSquare', 'toSquare', 'color', 'piece');
        }

        user = getUser(state);
        emit('move', {
          ...move,
          boardNum: user.board,
          gameId: state.get('gameId')
        });
        return state;
      }

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

export function getUser(state) {
  const players = state.get('players');
  if (players) {
    return getPlayer(state.get('userId'), players);
  }
}

/**
 *  Returns true if the proposed move is a promotion
 */
export function isPromotion(fromSquare, toSquare, state) {
  return state.get('moves').find(move =>
    move.get('from') === fromSquare && move.get('to') === toSquare &&
    move.get('promotion'));
}
