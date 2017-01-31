import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
// import Client from '../Client';
import Chessboard from './Chessboard/Chessboard';
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
    console.log(this.props.game.chess.fen());
    // if (this.props.game.turn) {
    //   console.log(this.props.game.turn);
    //   // Problem: Need to listen to chessjs being loaded to rerender component
    // }
    return (
      <div className="Game">
        <Chessboard />
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    game: state.game
  };
}

function mapDispatchToProps() {
  return {
    actions: bindActionCreators(gameActions)
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);
