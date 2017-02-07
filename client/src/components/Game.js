import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
// import Client from '../Client';
import ChessGame from './ChessGame';
import * as gameActions from '../actions/game';

// TODO: Load using redux
// This is a container component?
class Game extends Component {  
  // componentWillMount() {
  //   Client.getGame('123', (gameJson) => {
  //     console.log('gameJson', gameJson);
  //   });
  // }

  render() {
    return (
      <div className="Game">
        <ChessGame 
          actions={this.props.actions}
          game={this.props.game} />
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    game: state.game
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(gameActions, dispatch)
  };
}

// Redux stuffs
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);
