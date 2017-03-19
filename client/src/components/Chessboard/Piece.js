import React, { PropTypes, Component } from 'react';
import { DragSource } from 'react-dnd';
import cx from 'classnames';
import { getPieceColor } from './utils';
import { ItemTypes } from '../../constants/dndTypes';
import PieceImage from './PieceImage';
import { getEmptyImage } from 'react-dnd-html5-backend';

// Specifies the drag source contract.
const pieceSource = {
  beginDrag: (props) => {
    if (props.square) {
      props.beginDrag({
        square: props.square,
        piece: props.piece
      });
    }
    // Return the data describing the dragged item
    return {
      color: getPieceColor(props.piece),
      piece: props.piece,
      square: props.square  // NOT required
    };
  },

  endDrag: (props) => {
    if (props.square) {
      props.endDrag({
        square: props.square
      });
    }
  },

  // TODO: disallow drag if game isn't ready
  canDrag: (props) => {
    return getPieceColor(props.piece) === props.userColor;
  }
};

function collect(connect, monitor) {
  return {
    canDrag: monitor.isDragging(),
    connectDragPreview: connect.dragPreview(),
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

  componentDidMount() {
      // Use empty image as a drag preview so browsers don't draw it
      // and we can draw whatever we want on the custom drag layer instead.
      if (this.props.square) {
        this.props.connectDragPreview(getEmptyImage());
      }
  }

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
          {this._getImg()}
        </div>
      )
    );
  }

  _getImg() {
    const { piece } = this.props;
    if (piece !== '-') {
      return <PieceImage
        piece={piece} />;
    }
  }
}

export default DragSource(ItemTypes.PIECE, pieceSource, collect)(Piece);