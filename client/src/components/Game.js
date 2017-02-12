import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Dialog from 'material-ui/Dialog';

import ChessGame from './ChessGame';
import * as gameActions from '../actions/game';
import { getOpposingColor, getOtherBoard } from './Chessboard/utils';

class Game extends Component {  
  render() {
    const { actions, game } = this.props;
    const user = game.get('user');        
    const players = game.get('players');

    if (user) {
      const userBoard = user.get('board');
      const otherBoard = getOtherBoard(userBoard);

      return (
        <div className="Game">
          <div className="Game--user">            
            <ChessGame 
              actions={actions}
              board={game.getIn(['boards', userBoard])}
              boardNum={userBoard}
              isUserBoard={true}
              players={players.get(userBoard)}
              userColor={user.get('color')} />            
          </div>

          <div className="Game--other">
            <ChessGame 
              actions={actions}
              board={game.getIn(['boards', otherBoard])}
              boardNum={otherBoard}
              players={players.get(otherBoard)}
              userColor={getOpposingColor(user.get('color'))} />            
          </div>

          {this._renderDialog()}
        </div>
      );
    } else {
      return <div>Loading...</div>;
    }
  }

  _renderDialog() {
    return (
      <Dialog open={!this._isGameReady()}
        contentStyle={{maxWidth: '400px'}}>
        Waiting for all players to join game...
      </Dialog>
    );
  }

  _isGameReady() {
    const players = this.props.game.get('players');
    return players.get(0).size + players.get(1).size === 4;
  }
}


// Container component for 'game' reducer
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
