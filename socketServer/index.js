import shortid from 'shortid';
import _ from 'lodash-compat';

import * as redisClient from '../redisClient';
import { makeMove } from './move';


export default function startSocketServer(server) {
  const io = require('socket.io').listen(server);

  io.sockets.on('connection', function(socket) {
    const userId = socket.request.sessionID;
    let myGameId;                       // There is one socket for browser window

    socket.emit('join user', userId);   // Send back user ID based on session

    /**
     *  User joins room and gets all game updates.
     *   Can either be player or observer
     */
    socket.on('watch game', gameId => {
      socket.join(gameId, () => {
        myGameId = gameId;

        redisClient.getGame(gameId)
          .then((result) => {
            socket.emit('load game', _.extend(result, {gameId}));
          });
        });
    });

    socket.on('create game', () => {
      const gameId = shortid.generate(); // Generate random string for game id
      redisClient.createGame(gameId)
        .then((result) => {
          socket.emit('created game', gameId)
        });
      // TODO: Have this user automaticlaly join game... through both redis and event?
    });

    /**
     *  User joins game as a player
     */
    socket.on('join game', gameId => {
      redisClient.joinGame(gameId, userId)
        .then((players) => {
          io.to(myGameId).emit('update players', { players });
          console.log(`User ${userId} joined game ${gameId}.`);
          console.log('---> Players:', players);
        });
    });

    socket.on('move', data => {
      makeMove(data, (boardNum, fen, pieceReserve) => {
        io.to(myGameId).emit('update game', { boardNum, fen, pieceReserve });
      })
    });

    socket.on('disconnect', () => {
      if (!myGameId) {
        return;
      }
      redisClient.leaveGame(myGameId, userId)
        .then((players) => {
          // TODO: Broadcast to room
          io.to(myGameId).emit('update players', { players });
          console.log(`User ${userId} left game ${myGameId}.`);
          console.log('New players', players);
        });
    });
  });

  return io;
}
