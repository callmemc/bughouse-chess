import React, { PropTypes, Component } from 'react';
import { DragLayer } from 'react-dnd';
import { getSmartFontPiece } from './utils';
import { ItemTypes } from '../../constants/dndTypes';

class PieceDragLayer extends Component {
  static propTypes = {
    piece: PropTypes.string.isRequired
  };

  render() {
    if (!this.props.isDragging || this.props.itemType !== ItemTypes.PIECE) {
      return null;
    }

    return (
      <div className="PieceDragLayer">
        <div style={this._getItemStyles()}>
          <div className="Piece">
            {getSmartFontPiece(this.props.piece)}
          </div>
        </div>
      </div>
    );
  }

  // This is necessary for placing the drag preview with the cursor.
  //  See the DragLayer docs
  _getItemStyles() {
    const { currentOffset } = this.props;
    if (!currentOffset) {
      return {
        display: 'none'
      };
    }

    const { x, y } = currentOffset;
    const transform = `translate(${x}px, ${y}px)`;
    // const pillWidth = $('.actionsProperty__Pill').first().outerWidth();

    return {
      transform: transform,
      WebkitTransform: transform
      // ,
      // width: pillWidth
    };
  }
}

export default
  DragLayer((monitor) => ({
    itemType: monitor.getItemType(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  }))(PieceDragLayer);