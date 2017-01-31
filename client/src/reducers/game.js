import Constants from '../constants/index';
import chessjs from 'chess.js';

// am I supposed to use Immutable.js for state?
const chess = new chessjs();

// TODO: this will probably be sent with database
const initialState = {
  chess: chess,
  turn: 'w'
};

export default function game(state = initialState, action) {
  switch (action.type) {
    // TODO
    // case Constants.MAKE_MOVE:
    //   return {
    //     ...state,
    //     [action.payload.name]: action.payload.value, // ? what i'm confused
    //   };
    default:
      return state;
  }
}