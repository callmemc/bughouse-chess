// Redis client
// TODO: have start script automatically start redis server
import redis from 'redis';
import bluebird from 'bluebird';
import chessjs from 'chess.js';
import _ from 'lodash-compat';

import {playerOptions} from './utils';

// https://github.com/NodeRedis/node_redis#promises
bluebird.promisifyAll(redis.RedisClient.prototype);

const client = redis.createClient();

export default client;

const initialFen = new chessjs.Chess().fen();
const initialPieceReserve = JSON.stringify({ w: [], b: [] });
const initialPlayers = JSON.stringify([{}, {}]);
export function createGame(gameId) {
  return client.hmsetAsync(gameId, [
      "fen0", initialFen, 
      "fen1", initialFen, 
      "pieceReserve0", initialPieceReserve,
      "pieceReserve1", initialPieceReserve,
      "players", initialPlayers
    ])
    .catch(/*TODO*/);
}

export function updateGame(gameId, boardNum, fen, pieceReserve) {  
  if (pieceReserve) {
    const pieceReserveKey = `pieceReserve${pieceReserve.boardNum}`;

    return client.hgetAsync(gameId, pieceReserveKey)
      .then((result) => {
        // TODO: this isn't working
        const newPieceReserve = _.extend(JSON.parse(result), {
          [pieceReserve.color]: pieceReserve.result
        });

        return client.hmsetAsync(gameId, [
          `fen${boardNum}`, fen,
          pieceReserveKey, JSON.stringify(newPieceReserve)
        ]);
      });
  } else {
    return client.hmsetAsync(gameId, [`fen${boardNum}`, fen]);
  }
}

export function getGame(gameId) {
  return client.hgetallAsync(gameId)
    .then((game) => {   
      return {
        boards: [
          {
            fen: game.fen0,
            pieceReserve: JSON.parse(game.pieceReserve0)
          },
          {
            fen: game.fen1,
            pieceReserve: JSON.parse(game.pieceReserve1)
          }
        ],
        players: JSON.parse(game.players)
      };
    })
    .catch(/*TODO*/);  
}

export function joinGame(gameId, userId, callback) {  
  let players;
  return client.hgetAsync(gameId, "players")
    .then((result) => {
      players = JSON.parse(result);
      // Assign new player to first available board and color   
      const newPlayer = playerOptions.find(user =>
        !players[user.board][user.color]);

      if (newPlayer) {
        players[newPlayer.board][newPlayer.color] = userId;
        return client.hsetAsync(gameId, 'players', JSON.stringify(players));          
      }
    })
    .then((result) => {
      return players;
    })          
    .catch(/*TODO*/);
}

export function leaveGame(gameId, userId, callback) {
  let players;
  return client.hgetAsync(gameId, "players")
    .then((result) => {
      players = JSON.parse(result);      

      // TODO: figure out why players is randomly undefined and throwing error
      const foundPlayer = playerOptions.find(user =>
        players[user.board][user.color] == userId);

      if (foundPlayer) {
        delete players[foundPlayer.board][foundPlayer.color];
        return client.hsetAsync(gameId, 'players', JSON.stringify(players));          
      }
    })
    .then((result) => {
      return players;
    })          
    .catch(/*TODO*/);  
}
