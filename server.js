// babel-node?
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
// var models = require('./models');

app.set('port', (process.env.PORT || 3001));

// TEMP IN MEMORY SUPER HACKY "DATABASE"
var users = [{}, {}];

app.get('/api/game/:gameId', function (req, res) {
  const MOCK_RESPONSE = {
    gameId: 'test123'
  };

	res.json(MOCK_RESPONSE);
});

var userOptions = [
	{board: 0, color: 'w'},
	{board: 0, color: 'b'},
	{board: 1, color: 'w'},
	{board: 1, color: 'b'}
]; 

	// [0, 'b'], [1, 'w'], [1, 'b']];


io.on('connection', function(socket) {
	var myUser;
	const userId = socket.id; // temp. should be session based?
	console.log('a user connected!', userId); 

	// Assign user to a board number and color, with the first board
	//  and white taking priority
	userOptions.some(user => {
		if (!users[user.board][user.color]) {
			users[user.board][user.color] = userId;
			myUser = user;
			socket.emit('join game', user);
			console.log('joined game:', userId, user); 
			return true;
		}
	});
	console.log(users);

	socket.on('move', (data) => {
		console.log('MOVE:', data);
		io.emit('update game', data);
	});	

	socket.on('disconnect', () => {
		if (myUser) {
			delete users[myUser.board][myUser.color];
			console.log('user disconnected', socket.id);
			console.log(users);
		}
  });
});

var port = app.get('port');
http.listen(port, function () {
 	console.log('Example app listening on port ' + port);
});
