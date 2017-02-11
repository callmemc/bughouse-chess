import React, { PropTypes, Component } from 'react';
import { DropTarget } from 'react-dnd';

import Piece from './Piece';
import { COLUMN_MAP } from './utils';
import { ItemTypes } from '../../constants/dndTypes';

const squareTarget = {
  // canDrop: (props) => {
  //   // TODO
  // },

  drop: (props, monitor, component) => {    
    const item = monitor.getItem();
    const toSquare = props.file + props.rank;

    if (item.square) {
      props.makeMove({ 
        fromSquare: item.square, 
        toSquare
      });        
    } else {
      props.dropMove({  
        toSquare, 
        color: item.color,
        piece: item.piece
      });  
    }
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget()
  };
}

class Square extends Component {
  static propTypes = {
    rank: PropTypes.number.isRequired,
    file: PropTypes.string.isRequired,

    // The following props are injected by React DnD, as defined by the 'collect' function
    connectDropTarget: PropTypes.func.isRequired
  };

  render() {
    const sum = this.props.rank + COLUMN_MAP[this.props.file];
    const squareColor = sum % 2 === 0 ?
      'black' : 'white';

    return (
      this.props.connectDropTarget(
        <div className="Chessboard-square-container">
            <div className={`Chessboard-square ${squareColor}`}>
              <Piece 
                piece={this.props.piece} 
                square={this._getBoardSquare()}
                userColor={this.props.userColor} />
          </div>
        </div>
      )
    );
  }

  _getBoardSquare() {
    return this.props.file + this.props.rank;
  }
}

export default DropTarget(ItemTypes.PIECE, squareTarget, collect)(Square);