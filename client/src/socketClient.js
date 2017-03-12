import io from 'socket.io-client';
import { hashHistory } from 'react-router'

import store from './store';
import { updatePlayers, joinUser, updateGame, loadGame } from './actions/game';

let socket;

export function initializeSocket(gameId) {
  socket = io();

  if (gameId) {
    // joins a room when you're on a specific game page
    socket.emit('watch game', gameId);
  }

  // These are reactions from server
  socket.on('update players', (data) => {
    store.dispatch(updatePlayers(data));
  });

  socket.on('join user', (userId) => {
    store.dispatch(joinUser(userId));
  });

  socket.on('update game', (data) => {
    store.dispatch(updateGame(data));
  });

  socket.on('load game', (data) => {
    store.dispatch(loadGame(data));
  });

  socket.on('created game', (gameId) => {
    // store.dispatch(loadGame(data));
    // TODO: reroute the user to the game page
    hashHistory.push(`/game/${gameId}`);
  });
}

export function emit(action, data) {
  socket.emit(action, data);
}