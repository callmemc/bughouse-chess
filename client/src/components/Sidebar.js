import React, { PropTypes, Component } from 'react';
import { Map } from 'immutable';

import { getOpposingColor, getTeam } from './Chessboard/utils';

/** 
 *  Sidebar of a game
 */
class Sidebar extends Component {  
  static propTypes = {
    boardNum: PropTypes.number.isRequired,
    players: PropTypes.instanceOf(Map).isRequired,
    turn: PropTypes.string.isRequired,
    userColor: PropTypes.oneOf(['w', 'b'])
  };

  render() {
    const { boardNum, players, turn, userColor } = this.props;
    const opponentColor = getOpposingColor(userColor);

    return (
      <div className="Sidebar">                
        <div>
          <Clock 
            color={opponentColor} 
            turn={turn} 
            userColor={userColor} />
          <Player
            joined={!!players.get(opponentColor)}
            team={getTeam(boardNum, opponentColor)} />
        </div>
        <div>
          <Player
            joined={!!players.get(userColor)}
            team={getTeam(boardNum, userColor)} />
          <Clock 
            color={userColor} 
            turn={turn}
            userColor={userColor} />                  
          </div>
      </div>
    );
  }
}

class Clock extends Component {
  static propTypes = {
    color: PropTypes.string.isRequired,
    turn: PropTypes.string.isRequired,
    userColor: PropTypes.string.isRequired
  };

  render() {
    const {color, turn, userColor} = this.props;
    let text;
    if (color === turn) {
      text = color === userColor ? 
        "Your turn!" : 
        "Waiting for opponent";
    }
    
    return <div className='Clock'>{text}</div>
  }
}

class Player extends Component {
  static propTypes = {
    joined: PropTypes.bool,
    team: PropTypes.number
  };

  render() {
    // Temp until we get users
    const name = this.props.joined ? 'Anonymous' : 'Waiting...';
    return (
      <div className={`Player Player--team-${this.props.team}`}>
        {name}
      </div>
    );
  }
}

export default Sidebar;
