import Constants from '../constants';

// Action creators = functions that create actions (the payloads)

export function dropMove(payload) {
  return {
    type: Constants.DROP_MOVE,
    ...payload
  };
}

export function makeMove(payload) {
  return {
    type: Constants.MAKE_MOVE,
    ...payload
  };
}

export function updateGame(payload) {
  return {
    type: Constants.UPDATE_GAME,
    ...payload
  };
}

export function updatePlayers(payload) {
  return {
    type: Constants.UPDATE_PLAYERS,
    ...payload
  };
}

export function joinUser(payload) {
  return {
    type: Constants.JOIN_USER,
    ...payload
  };
}