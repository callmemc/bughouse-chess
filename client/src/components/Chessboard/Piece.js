import React, { PropTypes, Component } from 'react';
import { DragSource } from 'react-dnd';
import cx from 'classnames';
import { getSmartFontPiece } from './utils';
import { ItemTypes } from '../../constants/dndTypes';

// Specifies the drag source contract.
const pieceSource = {
  beginDrag: (props) => {
    // Return the data describing the dragged item
    return {
      square: props.square
    };
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

// TODO: piece needs an identifier?
class Piece extends Component {
  static propTypes = {
    piece: PropTypes.string.isRequired,

    // The following props are injected by React DnD, as defined by the 'collect' function
    // connectDragPreview: PropTypes.func.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired
  };

  render() {
    return (
      this.props.connectDragSource(
        <div className={cx({
            "Chessboard-piece": true,
            "dragging": this.props.isDragging
          })}
          draggable="true">
          {getSmartFontPiece(this.props.piece)}
        </div>
      )
    );
  }
}

// GameActions.startMove({
//     square: this._getSquare(),
//     gameNum: this.props.gameNum
// });

export default DragSource(ItemTypes.PIECE, pieceSource, collect)(Piece);