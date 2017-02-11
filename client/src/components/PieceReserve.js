import React, { PropTypes, Component } from 'react';
import { List } from 'immutable';

import Piece from './Chessboard/Piece';

/** 
 *  Holds pieces that can be dropped
 */
class PieceReserve extends Component {
  static propTypes = {
    queue: PropTypes.instanceOf(List).isRequired
  };

  render() {      
    // TODO: does each piece need it's own unique identifier?
    return (
      <div className="PieceReserve">  
        {this.props.queue.map((piece, i) => (
          <div className="PieceReserve__piece-container">
            <Piece key={i}
              piece={piece} 
              userColor={this.props.userColor} />  
          </div>
        ))}
      </div>
    );
  }
}

export default PieceReserve;