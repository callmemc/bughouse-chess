import React, { PropTypes, Component } from 'react';
import { DragSource } from 'react-dnd';
import cx from 'classnames';
import { getSmartFontPiece, getPieceColor } from './utils';
import { ItemTypes } from '../../constants/dndTypes';

// Specifies the drag source contract.
const pieceSource = {
  beginDrag: (props) => {
    // Return the data describing the dragged item
    return {
      color: getPieceColor(props.piece),
      piece: props.piece,
      square: props.square  // NOT required
    };
  },

  // TODO: disallow drag if game isn't ready
  canDrag: (props) => {
    return getPieceColor(props.piece) === props.userColor;
  }
};

function collect(connect, monitor) {
  return {
    canDrag: monitor.isDragging(),
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

// TODO: piece needs an identifier?
class Piece extends Component {
  static propTypes = {
    piece: PropTypes.string.isRequired,
    square: PropTypes.string,   // If not there, then it's in the pieceReserve

    // The following props are injected by React DnD, as defined by the 'collect' function
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired
  };

  render() {
    const { isDragging, connectDragSource } = this.props;

    const opacity = isDragging ? 0 : 1;
    return (
      connectDragSource(
        <div className={cx({
            "Piece": true,
            "Piece--dragging": isDragging
          })}
          style={{ opacity }}>
          {getSmartFontPiece(this.props.piece)}
        </div>
      )
    );
  }
}

export default DragSource(ItemTypes.PIECE, pieceSource, collect)(Piece);