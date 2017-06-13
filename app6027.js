var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
	res.send('<h1>Server on work!</h1>\n');
});

io.on('connection', function(socket){
	console.log("connect")
	io.emit('message', {message:"welcome"});
});

http.listen(6027, function(){
	console.log(`[${(new Date()).toString()}]: listening on *:6027`);
});