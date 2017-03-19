import React, { PropTypes, Component } from 'react';
import { getPieceColor } from './utils';

class PieceImage extends Component {
  render() {
    const { piece } = this.props;
    const imgSrc = require(`../../img/${this._getPiecePath()}.svg`);
    return <img src={imgSrc} className="Piece__image" alt={piece} />;
  }

  _getPiecePath() {
    const color = getPieceColor(this.props.piece);
    return color + this.props.piece.toUpperCase();
  }
}
export default PieceImage;