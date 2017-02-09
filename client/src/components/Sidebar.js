import React, { PropTypes, Component } from 'react';
import { Map, List } from 'immutable';

import Piece from './Chessboard/Piece';
import { getOpposingColor } from './Chessboard/utils';

/** 
 *  Sidebar of a game
 */
class Sidebar extends Component {  
  static propTypes = {
    pieceReserve: PropTypes.instanceOf(Map),
    userColor: PropTypes.oneOf(['w', 'b'])
  };

  render() {
    const { pieceReserve, userColor, turn } = this.props;
    const opponentColor = getOpposingColor(userColor);

    return (
      <div className="Sidebar">        
        <PieceReserve
          color={opponentColor}
          queue={pieceReserve.get(opponentColor)} />
        <Clock 
          color={opponentColor}
          turn={turn} />
        <Clock 
          color={userColor}
          turn={turn} />
        <PieceReserve 
          color={userColor}
          queue={pieceReserve.get(userColor)} />
      </div>
    );
  }
}


/** 
 *  Holds pieces that can be dropped
 */
class PieceReserve extends Component {
  static propTypes = {
    color: PropTypes.string.isRequired, // TODO: rename to side?
    queue: PropTypes.instanceOf(List).isRequired
  };

  render() {      
    // TODO: does each piece need it's own unique identifier?
    return (
      <div className="Sidebar-piece-queue">  
        {this.props.queue.map((piece, i) => (
          <Piece key={i}
            color={this.props.color}
            piece={piece} />  
        ))}
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

export default Sidebar;
