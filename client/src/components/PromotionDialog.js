import Dialog from 'material-ui/Dialog';
import React, { PropTypes, Component } from 'react';
import { List } from 'immutable';
import { connect } from 'react-redux';

import { makeMove } from '../actions/game';
import PieceImage from './Chessboard/PieceImage';

class PromotionDialog extends Component {
  static propTypes = {
    moves: PropTypes.instanceOf(List).isRequired
  };

  render() {
    return (
      <Dialog open={true} contentStyle={{maxWidth: '400px'}}>
        <div className="Promotion">
          {this.props.moves.map(move =>
            <div key={move.get('promotion')}
              className="Piece"
              onClick={() => this.handleClick(move.get('promotion'))}>
              <PieceImage piece={move.get('promotion')} />
            </div>
          )}
        </div>
      </Dialog>
    );
  }

  handleClick = (piece) => {
    this.props.makeMove({
      promotion: piece
    });
  }
}


function mapDispatchToProps(dispatch) {
  return {
    // I only want the makeMove action
    // actions: bindActionCreators(gameActions, dispatch)
    makeMove: (data) => {
      dispatch(makeMove(data))
    }
  };
}

export default connect(
  null,
  mapDispatchToProps
)(PromotionDialog);