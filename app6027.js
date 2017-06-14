var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var path = require("path");
app.get('/', (req, res) => {
	res.send('<h1>Server on work!</h1>\n');
});

app.get("/t", function(req, res){
	res.sendfile("test.html", res);
    //console.log("Visit  "+req.url);
});

io.on('connection', (socket) => {
	console.log("connect")
	socket.emit('message', {
		message: "welcome"
	}, (ee) => {
		console.info("消息发送回调以及收到回调应答：" + ee);
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
		console.log("cmd:" + obj)
	});

	// //单独对连接的定时器
	// const i_handler = setInterval(() => {
	// //	console.log("定时器")
	// 	socket.emit("timmer", (new Date()).toString());
	// }, 1000);

});

	//广播式的定时器
	const i_handler = setInterval(() => {
		//console.log("定时器")
		io.emit("timmer", (new Date()).toString());
	}, 1000);


http.listen(6027, () => {
	console.log(`[${(new Date()).toString()}]: listening on *:6027`);
});