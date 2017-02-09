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
    game: PropTypes.object.isRequired
  };

  render() {
    const { actions, game } = this.props;
    const userColor = game.get('userColor');

    if (userColor) {
      return (
        <div className="ChessGame">
          <Chessboard 
            fen={game.get('fen')}
            makeMove={actions.makeMove}
            userColor={userColor} />
          <Sidebar 
            turn={game.get('turn')}
            pieceReserve={game.get('pieceReserve')} 
            userColor={userColor} />   
        </div>
      );
    } else {
      return (
        <div className="ChessGame">Loading...</div>
      );
    }
  }
}


// React Dnd stuffs
export default DragDropContext(HTML5Backend)(ChessGame);
