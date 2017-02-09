// babel-node?
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
// var models = require('./models');

app.set('port', (process.env.PORT || 3001));

// TEMP IN MEMORY SUPER HACKY "DATABASE"
var users = {};

app.get('/api/game/:gameId', function (req, res) {
  const MOCK_RESPONSE = {
    gameId: 'test123'
  };

	res.json(MOCK_RESPONSE);
});

io.on('connection', function(socket) {
	const userId = socket.id; // temp. should be session based?
	console.log('a user connected!', userId); 

	// Assign user to a color, with white taking priority
	var userColor;
	if (!users['w']) {
		userColor = 'w';
	} else if (!users['b']) {
		userColor = 'b';		
	}

	if (userColor) {
		users[userColor] = userId;
		socket.emit('join game', userColor);
	} else {
		// TODO
	}

	console.log(users);

	socket.on('move', (data) => {
		console.log('MOVE:', data);
		io.emit('update game', data);
	});	

	socket.on('disconnect', () => {
		console.log('user disconnected', socket.id);
		delete users[userColor];
  });
});

var port = app.get('port');
http.listen(port, function () {
 	console.log('Example app listening on port ' + port);
});
