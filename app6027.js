var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
	res.send('<h1>Server on work!</h1>\n');
});

io.on('connection', (socket) => {
	console.log("connect")
	socket.emit('message', { message: "welcome" },(ee)=>{
		console.info(ee);
	});

	//console.log("socket.conn:",socket.conn);

	// io.clients(function (error, clients) {
	// 	if (error) throw error;
	// 	console.log("clients:",clients); // => [6em3d4TJP8Et9EMNAAAA, G5p55dHhGgUnLUctAAAB]
	// });

	// io.of('/chat').clients(function (error, clients) {
	// 	if (error) throw error;
	// 	console.log("test:",clients); // => [6em3d4TJP8Et9EMNAAAA, G5p55dHhGgUnLUctAAAB]
	// });


	socket.on("disconnect", (obj) => {
		console.log("disconnect !!! ")
	});
	socket.on("cmd", (obj) => {
		console.log("cmd:"+obj)
	});

});






http.listen(6027, () => {
	console.log(`[${(new Date()).toString()}]: listening on *:6027`);
});