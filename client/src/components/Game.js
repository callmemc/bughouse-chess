import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import ChessGame from './ChessGame';
import * as gameActions from '../actions/game';

// This is a container component for the game reducer?
class Game extends Component {  
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
    game: state.get('game')
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
