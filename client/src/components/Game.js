import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import ChessGame from './ChessGame';
import * as gameActions from '../actions/game';
import { getOpposingColor, getOtherBoard } from './Chessboard/utils';

// This is a container component for the game reducer?
class Game extends Component {  
  render() {
    const { actions, game } = this.props;
    const userBoard = game.getIn(['user', 'board']);
    const otherBoard = getOtherBoard(userBoard);
    const user = game.get('user');

    if (user) {
      return (
        <div className="Game">
          <div className="Game--user">
            <ChessGame 
              actions={actions}
              board={game.getIn(['boards', userBoard])}
              userColor={user.get('color')} />
            <div>Game {userBoard + 1}</div>
          </div>

          <div className="Game--other">
            <ChessGame 
              actions={actions}
              board={game.getIn(['boards', otherBoard])}
              userColor={getOpposingColor(user.get('color'))} />
            <div>Game {otherBoard + 1}</div>
          </div>
        </div>
      );
    } else {
      return <div>Loading...</div>;
    }
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
