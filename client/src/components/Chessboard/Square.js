import React, { PropTypes, Component } from 'react';
import { DropTarget } from 'react-dnd';

import { COLUMN_MAP } from './utils';
import Piece from './Piece';
import { ItemTypes } from '../../constants/dndTypes';

const squareTarget = {
  // canDrop: (props) => {
  //   // TODO
  // },

  drop: (props, monitor, component) => {    
    const item = monitor.getItem();
    const fromSquare = item.square;

    const toSquare = props.file + props.rank;
    props.makeMove({fromSquare: fromSquare, toSquare: toSquare});        
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
                square={this.props.file + this.props.rank}/>
          </div>
        </div>
      )
    );
  }      

  // handle drop
  // GameActions.makeMove({
  //     square: this._getSquare(),
  //     gameNum: this.props.gameNum,
  //     takenPiece: this.props.piece
  // });

  _getSquare() {
    return this.props.file + this.props.rank;
  }
}

export default DropTarget(ItemTypes.PIECE, squareTarget, collect)(Square);