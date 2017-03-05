import React, { Component } from 'react';
import { IndexLink } from 'react-router';
import AppBar from 'material-ui/AppBar';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <AppBar
          className="App-header"
          title={<IndexLink to="/">Chowhouse</IndexLink>}
          showMenuIconButton={false}
          style={{backgroundColor: '#24292e'}}/>
        <div className="App__container">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default App;
