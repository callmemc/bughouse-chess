import React, { PropTypes, Component } from 'react';
import cx from 'classnames';

// TODO: util
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

class Chessboard extends Component {
	render() {
    return (
      <div className="Chessboard">
        THIS IS A CHESSBOARD
        <Square />
        <Square />
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
      row: PropTypes.number.isRequired,
      col: PropTypes.string.isRequired
    };

    render() {
      const sum = this.props.row + COLUMN_MAP[this.props.col];
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
                {/*ChessPieces[this.props.piece]*/}
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
      return this.props.col + this.props.row;
    }
  }

export default Chessboard;