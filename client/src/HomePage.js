import React, { Component } from 'react';
import {connect} from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import {createGame} from './actions/game';
import Client from './Client';
import { initializeSocket } from './socketClient';

class HomePage extends Component { 
  state = {
    displayCreateDialog: false
  };

  componentWillMount() {
    // Hits server to initialize session before socket connection is
    //  initialized, so that socket can share the server-initialized session
    Client.getSession(() => {
      initializeSocket();
    });
  }

  render() {
    return (
      <div className="HomePage">
        <h1>Welcome to Chowhouse!</h1>
        <RaisedButton 
          label="Create Game"
          onTouchTap={this.handleOpenDialog}
          primary={true} />

        {this.renderCreateDialog()}
      </div>
    );
  }

  renderCreateDialog() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleCloseDialog}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleSubmit}
      />,
    ];

    return (
      <Dialog 
        title="Create Bughouse Game"
        open={this.state.displayCreateDialog}
        actions={actions}>
        Click "Submit" to start a new bughouse game that you can play with your friends!
      </Dialog>
    );
  }

  handleOpenDialog = () => {
    this.setState({ displayCreateDialog: true });
  };

  handleCloseDialog = () => {
    this.setState({ displayCreateDialog: false });
  };

  handleSubmit = () => {
    // this.handleCloseDialog();
    this.props.onCreateGame();
  };
}

const mapStateToProps = (state, ownProps) => {
  return {};
}

const mapDispatchToProps = (dispatch) => {
  return {
    onCreateGame: () => {
      dispatch(createGame())
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage);