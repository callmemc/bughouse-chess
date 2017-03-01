import React, { Component } from 'react';
import './App.css';
// import Client from './Client';
// import { initializeSocket } from './socketClient';

class App extends Component {
  // componentWillMount() {
  //   // Hits server to initialize session before socket connection is
  //   //  initialized, so that socket can share the server-initialized session
  //   Client.getSession(() => {
  //     initializeSocket();
  //   });
  // }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <div className="App-header__text">
            Chowhouse
          </div>
        </div>
        <div className="App__container">        
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default App;
