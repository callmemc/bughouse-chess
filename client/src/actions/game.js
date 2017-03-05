import Constants from '../constants';

// Action creators = functions that create actions (the payloads)

export function beginDrag(payload) {
  return {
    type: Constants.BEGIN_DRAG,
    ...payload
  };
}

export function endDrag(payload) {
  return {
    type: Constants.END_DRAG,
    ...payload
  };
}

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

export function createGame() {
  return {
    type: Constants.CREATE_GAME
  };
}

export function updateGame(payload) {
  return {
    type: Constants.UPDATE_GAME,
    ...payload
  };
}

export function loadGame(payload) {
  return {
    type: Constants.LOAD_GAME,
    ...payload
  };
}

export function updatePlayers(payload) {
  return {
    type: Constants.UPDATE_PLAYERS,
    ...payload
  };
}

export function joinUser(userId) {
  return {
    type: Constants.JOIN_USER,
    userId
  };
}