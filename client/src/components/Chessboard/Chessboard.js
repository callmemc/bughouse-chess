import React, { PropTypes, Component } from 'react';
import _ from 'lodash-compat';

import './Chessboard.css';
import Square from './Square';
import { getPieces2DArray, COLUMN_MAP } from './utils';

const RANKS = [8, 7, 6, 5, 4, 3, 2, 1];
const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

class Chessboard extends Component {
  static propTypes = {
    dropMove: PropTypes.func.isRequired,
    fen: PropTypes.string.isRequired,
    makeMove: PropTypes.func.isRequired,
    beginDrag: PropTypes.func.isRequired,
    endDrag: PropTypes.func.isRequired,
    userColor: PropTypes.oneOf(['w', 'b'])
  };

	render() {
    const { fen, userColor } = this.props;

    // TODO: memoize this so not recalculated every time
    const ranks = userColor === 'w' ? RANKS : RANKS.slice().reverse();
    const files = userColor === 'w' ? FILES : FILES.slice().reverse();

    // TODO: this should be in the reducer, so not recalculated on
    //  every render--instead, only recalculated when pieces change
    // TODO: I think we can actually replace this with chess.board()
    //  https://github.com/jhlywa/chess.js/blob/master/README.md#board
    const pieces = getPieces2DArray(fen);

    return (
      <div className="Chessboard">
        {_.map(ranks, rank =>
          <div className="Chessboard-row" key={rank}>
            <div className="Chessboard-row-label-square">
              <div className="Chessboard-column-label-text">
                {rank}
              </div>
            </div>
            {_.map(files, file =>
              <Square
                key={file}
                boardNum={this.props.boardNum}
                rank={rank}
                file={file}
                isActive={this._isActiveSquare(file, rank)}
                piece={pieces[rank-1][COLUMN_MAP[file]-1]}
                dropMove={this.props.dropMove}
                makeMove={this.props.makeMove}
                beginDrag={this.props.beginDrag}
                endDrag={this.props.endDrag}
                userColor={userColor} />
            )}
          </div>
        )}
        {this._renderFileLabels()}
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

  _isActiveSquare(file, rank) {
    const square = file + rank;
    const { moves } = this.props;
    return !!(moves && moves.find(move => move.get('to') === square));
  }
}

export default Chessboard;