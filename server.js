// babel-node?
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 3001));

app.get('/', function (req, res) {
  res.send('Hello World!')
});

//
app.get('/api/game/:gameId', function (req, res) {
  const MOCK_RESPONSE = {
    gameId: 'test123'
  };

 	res.json(MOCK_RESPONSE);
});

var port = app.get('port');
app.listen(port, function () {
 	console.log('Example app listening on port ' + port);
});