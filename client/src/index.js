import React from 'react';
import ReactDOM from 'react-dom';
// import { createStore } from 'redux';
import { Provider } from 'react-redux';
// import { Map } from 'immutable';

import App from './App';
import './index.css';
import store from './store';
// import rootReducer from './reducers';

// See http://redux.js.org/docs/basics/ExampleTodoList.html
// TODO: move this into separate store/configureStore.js file?
// const initialState = Map();
// const store = createStore(rootReducer, initialState);


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
