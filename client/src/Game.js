import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import ChessGame from './components/ChessGame';
import * as gameActions from './actions/game';
import { getOpposingColor, getOtherBoard, getPlayer } from './components/Chessboard/utils';
import { emit, initializeSocket } from './socketClient';
import Client from './Client';

class Game extends Component {
  componentWillMount() {
    // Hits server to initialize session before socket connection is
    //  initialized, so that socket can share the server-initialized session
    Client.getSession(() => {
      initializeSocket(this.props.params.gameId);
    });
  }

  render() {
    const { actions, game } = this.props;    
    const players = game.get('players'); 
    const userId = game.get('userId');   
    const user = getPlayer(userId, players);

    if (user) {
      const userBoard = user.board;
      const userColor = user.color;
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
              userColor={userColor} />            
          </div>

          <div className="Game--other">
            <ChessGame 
              actions={actions}
              board={game.getIn(['boards', otherBoard])}
              boardNum={otherBoard}
              players={players.get(otherBoard)}
              userColor={getOpposingColor(userColor)} />            
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <h1>Loading...</h1>
          {this.renderJoinDialog()}          
        </div>
      );
    }
  }

  renderJoinDialog() {
    const actions = [
      <FlatButton
        label="No"
        primary={true}
        onTouchTap={this.handleCloseDialog}
      />,
      <FlatButton
        label="Yes"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.joinGame}
      />,
    ];

    return (
      <Dialog open={true}
        contentStyle={{maxWidth: '400px'}}
        actions={actions}>
        Join game?
      </Dialog>
    );
  }

  joinGame = () => {
    const gameId = this.props.params.gameId;
    emit('join game', gameId);
  }

  // _renderDialog() {
  //   return (
  //     <Dialog open={!this._isGameReady()}
  //       contentStyle={{maxWidth: '400px'}}>
  //       Waiting for all players to join game...
  //     </Dialog>
  //   );
  // }

  // TODO: move this into a selector?
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
