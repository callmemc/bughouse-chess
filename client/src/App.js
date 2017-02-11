import React, { Component } from 'react';
import './App.css';
import Game from './components/Game'

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <div className="App-header__text">
            Chowhouse
          </div>
        </div>        
        <Game />
      </div>
    );
  }
}

export default App;
