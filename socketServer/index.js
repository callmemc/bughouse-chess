import shortid from 'shortid';
import _ from 'lodash-compat';

import * as redisClient from '../redisClient';
import { makeMove } from './move';


export default function startSocketServer(http) {
  const io = require('socket.io')(http);  

  io.on('connection', function(socket) {
    const userId = socket.request.sessionID;
    let myGameId;   // TODO: find better way to leave game on socket disconnect
                    //  rooms that have the room id = gameId?

    socket.emit('join user', userId);   // Send back user ID based on session

    /**
     *  User joins room and gets all game updates. 
     *   Can either be player or observer
     */
    socket.on('watch game', gameId => {           
      // TODO: join room... socket.join(gameId, () => { socket.emit('') });      
      myGameId = gameId;
      redisClient.getGame(gameId)
        .then((result) => {
          socket.emit('load game', _.extend(result, {gameId}));
        });
    });

    socket.on('create game', () => {
      const gameId = shortid.generate(); // Generate random string for game id
      redisClient.createGame(gameId);      
      socket.emit('created game', gameId);  
      // TODO: Have this user join game... through both redis and event?
    });
    
    /**
     *  User joins game as a player
     */
    socket.on('join game', gameId => {            
      redisClient.joinGame(gameId, userId)
        .then((players) => {
          // TODO: Broadcast to room
          io.emit('update players', { players });
          console.log(`User ${userId} joined game ${gameId}.`);
          console.log('New players', players);
        });      
    });
    
    socket.on('move', data => {
      makeMove(data, (boardNum, fen, pieceReserve) => {
        console.log('socket boardNum', boardNum);
        // TODO: Broadcast to room
        io.emit('update game', { boardNum, fen, pieceReserve }); 
      })
    });      

    socket.on('disconnect', () => {
      redisClient.leaveGame(myGameId, userId)
        .then((players) => {
          // TODO: Broadcast to room
          io.emit('update players', { players });
          console.log(`User ${userId} left game ${myGameId}.`);
          console.log('New players', players);
        });      
    });
  });

  return io;
}
