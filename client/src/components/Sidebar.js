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
          <Clock color={opponentColor} turn={turn} />
          <Player
            joined={!!players.get(opponentColor)}
            team={getTeam(boardNum, opponentColor)} />
        </div>
        <div>
          <Player
            joined={!!players.get(userColor)}
            team={getTeam(boardNum, userColor)} />
          <Clock color={userColor} turn={turn} />                  
          </div>
      </div>
    );
  }
}

class Clock extends Component {
  static propTypes = {
    color: PropTypes.string.isRequired, // TODO: rename to side?    
    turn: PropTypes.string.isRequired
  };

  render() {
    const {color, turn} = this.props;
    let text;
    if (color === turn) {
      text = color === 'w' ? "White's Turn" : "Black's Turn";
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
