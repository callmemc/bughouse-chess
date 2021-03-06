import React, { PropTypes, Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import _ from 'lodash-compat';
import { Map } from 'immutable';

import Chessboard from './Chessboard/Chessboard';
import PieceDragLayer from './Chessboard/PieceDragLayer';
import Sidebar from './Sidebar';
import PieceReserve from './PieceReserve';
import { getOpposingColor } from './Chessboard/utils';


/**
 *  This holds the user game that the user interacts with
 *   Drag n drop wrapper here
 *   Includes chessboard and piece queue
 */
class ChessGame extends Component {
  static propTypes = {
    board: PropTypes.object,
    boardNum: PropTypes.number.isRequired,
    players: PropTypes.instanceOf(Map).isRequired
  };

  render() {
    const { actions, board, boardNum, players, userColor } = this.props;

    if (board) {
      const pieceReserve = board.get('pieceReserve');
      const otherColor = getOpposingColor(userColor);

      return (
        <div className="ChessGame">
          <div className="ChessGame__play-area">
            <PieceReserve
              queue={pieceReserve.get(otherColor)}
              userColor={userColor} />
            <Chessboard
              boardNum={boardNum}
              fen={board.get('fen')}
              dropMove={actions.dropMove}
              makeMove={actions.makeMove}
              moves={this.props.moves}
              beginDrag={actions.beginDrag}
              endDrag={actions.endDrag}
              userColor={userColor} />
            <PieceReserve
              queue={pieceReserve.get(userColor)}
              userColor={userColor} />
          </div>
          <Sidebar
            boardNum={boardNum}
            players={players}
            status={board.get('status')}
            turn={board.get('turn')}
            userColor={userColor} />
          {this._renderDragLayer()}
        </div>
      );
    } else {
      return (
        <div>Loading</div>
      );
    }
  }

  _renderDragLayer() {
    if (this.props.isUserBoard && this.props.activePiece) {
      return <PieceDragLayer
          piece={this.props.activePiece} />;
    }
  }
}


// React Dnd stuffs
export default DragDropContext(HTML5Backend)(ChessGame);
