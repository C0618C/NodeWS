const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
	res.send('<h1>Server on work!</h1>\n');
});


io.on('connection', (socket) => {
	console.log("connect")
	socket.emit('message', {
		message: "welcome"
	}, (ee) => {
		console.info("消息发送回调以及收到回调应答：" + ee);
	});
	io.emit("msg", {
			sender: "服务器",
			text: "大家注意，有人来啦！"
		});

	//广播消息
	socket.on("msg", data => {
		io.emit("msg", data);
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

	// socket.on("cmd", (obj) => {
	// 	console.log("cmd:" + obj)
	// });

	// //单独对连接的定时器
	// const i_handler = setInterval(() => {
	// //	console.log("定时器")
	// 	socket.emit("timmer", (new Date()).toString());
	// }, 1000);


	socket.on("disconnect", (...x) => {
		io.emit("msg", {
			sender: "服务器",
			text: "有一个人离开了"
		});
		console.log(...x);
	});
});

//广播式的定时器
const timmer = io.of("/timeserver");
const i_handler = setInterval(() => {
	//console.log("定时器")
	timmer.emit("time", (new Date()).getTime());
}, 1);


http.listen(6027, () => {
	console.log(`[${(new Date()).toString()}]: listening on *:6027`);
});