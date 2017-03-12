import React, { PropTypes, Component } from 'react';
import { DropTarget } from 'react-dnd';
import cx from 'classnames';

import Piece from './Piece';
import { COLUMN_MAP, isValidDrop } from './utils';
import { ItemTypes } from '../../constants/dndTypes';

const squareTarget = {
  canDrop: (props, monitor) => {
    const item = monitor.getItem();
    const draggedPiece = item.piece;
    const targetPiece = props.piece;

    // TODO: Only allow drop if one of valid moves

    // If dropping from piece reserve, do not allow user to drop
    //  piece on a non-empty square, or drop a pawn on the first or last rank
    if (!item.square) {
      return targetPiece === '-' && isValidDrop(draggedPiece, props.rank);
    } else {
      return true;
    }
  },

  drop: (props, monitor, component) => {
    const item = monitor.getItem();
    props.makeMove({
      fromSquare: item.square,
      toSquare: props.file + props.rank,
      color: item.color,
      piece: item.piece
    });
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget()
  };
}

class Square extends Component {
  static propTypes = {
    isActive: PropTypes.bool,
    rank: PropTypes.number.isRequired,
    file: PropTypes.string.isRequired,
    piece: PropTypes.string,

    // The following props are injected by React DnD, as defined by the 'collect' function
    connectDropTarget: PropTypes.func.isRequired
  };

  render() {
    const sum = this.props.rank + COLUMN_MAP[this.props.file];
    const squareColor = sum % 2 === 0 ?
      'dark' : 'light';

    return (
      this.props.connectDropTarget(
        <div className="Chessboard-square-container">
            <div className={cx(`Chessboard-square
              Chessboard-square--${this.props.boardNum}
              ${squareColor}`, {
                'Chessboard-square--active': this.props.isActive
              })}>
              <Piece
                piece={this.props.piece}
                square={this._getBoardSquare()}
                beginDrag={this.props.beginDrag}
                endDrag={this.props.endDrag}
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