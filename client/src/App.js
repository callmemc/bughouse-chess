import React, { Component } from 'react';
import './App.css';
import Game from './components/Game'

// TODO: Load using redux

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Bughouse Chess!</h2>
        </div>        
        <Game />
      </div>
    );
  }
}

export default App;
