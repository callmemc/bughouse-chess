import Constants from '../constants/index';

// Action creators = functions that create actions (the payloads)
export function startMove({square, gameNum}) {
  return {
    type: Constants.START_MOVE,   //necessary
    payload: {                    // the rest of the object structure is up to me
      square,
      gameNum,    // 0 or 1. a bughouse game consists of 2 games
    },
  };
}