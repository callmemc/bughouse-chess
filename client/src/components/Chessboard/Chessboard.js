import React, { PropTypes, Component } from 'react';
import _ from 'lodash-compat';

import './Chessboard.css';
import Square from './Square';
import { getPieces2DArray, COLUMN_MAP } from './utils';

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
                  piece={pieces[rank-1][COLUMN_MAP[file]-1]} 
                  makeMove={this.props.makeMove} />
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

export default Chessboard;