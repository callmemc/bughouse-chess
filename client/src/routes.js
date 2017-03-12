import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import App from './App';
import Game from './Game';
import HomePage from './HomePage';

const Routes = (props) => (
  <Router {...props} history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={HomePage} />
      <Route path="/game/:gameId" component={Game} />
    </Route>
  </Router>
);

export default Routes;
