import io from 'socket.io-client';
import store from './store';
import { updatePlayers, joinUser, updateGame } from './actions/game';

// TODO: Move socket initialization under a JOIN action?
// https://exec64.co.uk/blog/websockets_with_redux/
const socket = io();

socket.on('update players', (data) => {
  store.dispatch(updatePlayers(data));
});

socket.on('join user', (data) => {
  store.dispatch(joinUser(data));
});

socket.on('update game', (data) => {
  store.dispatch(updateGame(data));
});

export default socket;