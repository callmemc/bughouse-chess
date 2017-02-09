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
      color: props.color,   // not required?
      piece: props.piece,
      square: props.square  // NOT required
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
    color: PropTypes.string,
    piece: PropTypes.string.isRequired,
    square: PropTypes.string,   // If not there, then it's in the pieceReserve

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

export default DragSource(ItemTypes.PIECE, pieceSource, collect)(Piece);