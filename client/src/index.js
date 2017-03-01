import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { browserHistory } from 'react-router';

import './index.css';
import store from './store';
import Routes from './routes';

// See https://www.npmjs.com/package/material-ui#react-tap-event-plugin
injectTapEventPlugin();

ReactDOM.render(
  <MuiThemeProvider>
    <Provider store={store}>
      <Routes history={browserHistory} />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
);


