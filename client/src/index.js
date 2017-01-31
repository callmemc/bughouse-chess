import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './App';
import './index.css';
import rootReducer from './reducers/index';

// See http://redux.js.org/docs/basics/ExampleTodoList.html
// TODO: move this into separate store/configureStore.js file?
const store = createStore(rootReducer); //TODO: pass in initialState?


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
