import React, { PropTypes, Component } from 'react';
import cx from 'classnames';
import _ from 'lodash-compat';

import './Chessboard.css';
import { getSmartFontPiece, getPieces2DArray } from './utils';

// TODO: find a better way to do this...
const COLUMN_MAP = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: 5,
  f: 6,
  g: 7,
  h: 8
};

const RANKS = [8, 7, 6, 5, 4, 3, 2, 1];
const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

class Chessboard extends Component {
  static propTypes = {
    chess: PropTypes.object.isRequired // chessjs instance object
  };

	render() {
    const fen = this.props.chess.fen();

    // TODO: this should be in the reducer, so not recalculated on 
    //  every render--instead, only recalculated when pieces change
    const pieces = getPieces2DArray(fen);

    return (
      <div className="Chessboard-container">
        <div className="Chessboard">
          {_.map(RANKS, rank =>
            <div className="Chessboard-row" key={rank}>
              <div className="Chessboard-row-label-square">
                <div className="Chessboard-column-label-text">
                  {rank}
                </div>
              </div>
              {_.map(FILES, file =>
                <Square
                  key={file}
                  rank={rank}
                  file={file}
                  piece={pieces[rank-1][COLUMN_MAP[file]-1]} />
              )}
            </div>
          )}
          {this._renderFileLabels()}
        </div>             
      </div>
    );
	}

  _renderFileLabels() {
    return (
      <div className="Chessboard-column-label-row">
        {_.map(FILES, (file, i) => 
          <div className="Chessboard-column-label-square"
            key={file}>
            <div className="Chessboard-column-label-text">
              {file}
            </div>
          </div>
        )}
      </div>
    );
  }
}

class Square extends Component {
    constructor(props) {
      super(props);
      this.state = {isDragging: false};
    }
    static propTypes = {
      rank: PropTypes.number.isRequired,
      file: PropTypes.string.isRequired
    };

    render() {
      const sum = this.props.rank + COLUMN_MAP[this.props.file];
      const squareColor = sum % 2 === 0 ?
        'black' : 'white';

      // const piece = this.state.isDragging ? undefined :
      //     ChessPieces[this.props.piece];

      return (
        <div className="Chessboard-square-container">
            <div className={`Chessboard-square ${squareColor}`}
              onDrop={this.handleDrop.bind(this)}
              onDragOver={this.handleDragOver.bind(this)}>
              <a className={cx({
                  "Chessboard-piece": true,
                  "dragging": this.state.isDragging
                })}
                draggable="true"
                ref='piece'
                onDragStart={this.handleDragStart.bind(this)}
                onDragEnd={this.handleDragEnd.bind(this)}>
                {getSmartFontPiece(this.props.piece)}
              </a>
          </div>
        </div>
      );
    }

    handleDragStart(e) {
      // var node = ReactDOM.findDOMNode(this.refs.piece);

      // Set custom drag image
      // Allows the current element to be blurred, but the dragged image
      // to be solid
      // http://www.kryogenix.org/code/browser/custom-drag-image.html
      // TODO: Fix this so don't need to append child to document
      // var crt = node.cloneNode(true);
      // document.body.appendChild(crt);
      // e.dataTransfer.setDragImage(crt, 20, 20);

      this.setState({isDragging: true});

      // GameActions.startMove({
      //     square: this._getSquare(),
      //     gameNum: this.props.gameNum
      // });
    }

    handleDragEnd() {
      this.setState({isDragging: false});
    }

    handleDrop(e) {
      e.preventDefault();

      // GameActions.makeMove({
      //     square: this._getSquare(),
      //     gameNum: this.props.gameNum,
      //     takenPiece: this.props.piece
      // });
    }

    handleDragOver(e) {
      e.preventDefault();
    }

    _getSquare() {
      return this.props.file + this.props.rank;
    }
  }

export default Chessboard;