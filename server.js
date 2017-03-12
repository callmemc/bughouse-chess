import express from 'express';
const app = express();
const server = require('http').createServer(app);
const RedisStore = require('connect-redis')(session);
import startSocketServer from './socketServer';
import session from 'express-session';
import redisClient from './redisClient';

const io = startSocketServer(server);

// app.set('trust proxy', 1);
app.set('port', (process.env.PORT || 3001));

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

// TODO: production-ready session store
//  See https://github.com/expressjs/session#compatible-session-stores
// TODO: use secure cookies in production
//  See https://github.com/expressjs/session#cookiesecure
const sessionMiddleware = session({
  secret: 'rJ1J9RVFe',
  saveUninitialized: true,
  resave: true,
  store: new RedisStore({
    client: redisClient
  }),
  cookie: {
    path: '/', httpOnly: false, secure: false, maxAge: null
  }
  //, proxy: true
});

// Note: this is not invoked until the server is hit
app.use(sessionMiddleware);

// Sharing sessions with socket.io and express
//  See http://stackoverflow.com/questions/25532692/how-to-share-sessions-with-socket-io-1-x-and-express-4-x
// Note: This relies on the express-session cookie (name = 'connect.sid').
//  If no such cookie is found, the 'io' cookie will be reset with every new socket connection
io.use((socket, next) => {
  sessionMiddleware(socket.request, socket.request.res, next);
});

// Logging out the session ID just for debugging purposes
// app.use((req, res, next) => {
//   console.log('req.sessionID:', req.sessionID);
//   next();
// });

app.get('/api/session', function (req, res) {
  res.send();
});

const port = app.get('port');
server.listen(port, () => {
 	console.log('Example app listening on port ' + port);
});
