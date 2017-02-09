import { createStore } from 'redux';
import { Map } from 'immutable';
import rootReducer from '../reducers';


const initialState = Map();
const store = createStore(rootReducer, initialState);

export default store;
