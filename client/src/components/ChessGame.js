import React, { PropTypes, Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import _ from 'lodash-compat';

import Chessboard from './Chessboard/Chessboard';
import Sidebar from './Sidebar';


/** 
 *  This holds the user game that the user interacts with
 *   Drag n drop wrapper here
 *   Includes chessboard and piece queue
 */
class ChessGame extends Component {  
  static propTypes = {
    board: PropTypes.object.isRequired
  };

  render() {
    const { actions, board, userColor } = this.props;

    return (
      <div className="ChessGame">
        <Chessboard 
          fen={board.get('fen')}
          dropMove={actions.dropMove}
          makeMove={actions.makeMove}
          userColor={userColor} />
        <Sidebar 
          turn={board.get('turn')}
          pieceReserve={board.get('pieceReserve')} 
          userColor={userColor} />   
      </div>
    );
  }
}


// React Dnd stuffs
export default DragDropContext(HTML5Backend)(ChessGame);
