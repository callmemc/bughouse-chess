import React, { PropTypes, Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import _ from 'lodash-compat';

import Chessboard from './Chessboard/Chessboard';


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
    return (
      <div className="ChessGame">
        <Chessboard 
          chess={_.get(this.props.game, 'chess')}
          makeMove={this.props.actions.makeMove}
          startMove={this.props.actions.startMove} />
        {/* TODO: Piece Queue */}    
      </div>
    );
  }
}


// React Dnd stuffs
export default DragDropContext(HTML5Backend)(ChessGame);
