var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require("fs");
var path = require("path");

app.get('/', function(req, res){
	res.send('<h1>Welcome Realtime Server</h1>');
    console.log("Someone visit ");
});

app.get('/chat', function(req, res){
	loadFile("page.html", res);
    console.log("Visit Chat ");
});

app.get("/*.js", function(req, res){
	loadFile(req.url.substr(1), res);
    console.log("Visit  "+req.url);
});


//在线用户
var onlineUsers = {};
//当前在线人数
var onlineCount = 0;

io.on('connection', function(socket){
	console.log('a user connected');
	
	//监听新用户加入
	socket.on('login', function(obj){
		//将新加入用户的唯一标识当作socket的名称，后面退出的时候会用到
		socket.name = obj.userid;
		
		//检查在线列表，如果不在里面就加入
		if(!onlineUsers.hasOwnProperty(obj.userid)) {
			onlineUsers[obj.userid] = obj.username;
			//在线人数+1
			onlineCount++;
		}
		
		//向所有客户端广播用户加入
		io.emit('login', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj});
		console.log(obj.username+'加入了聊天室');
	});
	
	//监听用户退出
	socket.on('disconnect', function(){
		//将退出的用户从在线列表中删除
		if(onlineUsers.hasOwnProperty(socket.name)) {
			//退出用户的信息
			var obj = {userid:socket.name, username:onlineUsers[socket.name]};
			
			//删除
			delete onlineUsers[socket.name];
			//在线人数-1
			onlineCount--;
			
			//向所有客户端广播用户退出
			io.emit('logout', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj});
			console.log(obj.username+'退出了聊天室');
		}
	});
	
	//监听用户发布聊天内容
	socket.on('message', function(obj){
		//向所有客户端广播发布的消息
		io.emit('message', obj);
		console.log(obj.username+'说：'+obj.content);
	});
  
});

http.listen(6027, function(){
	console.log('listening on *:6027');
});



function loadFile(pathname, res) {
    switch (path.extname(pathname)) {
        case "":
            res.writeHead(200, { "Content-Type": "text/plain" });
            break;
        case ".html":
            res.writeHead(200, { "Content-Type": "text/html" });
            break;
        case ".js":
            res.writeHead(200, { "Content-Type": "text/javascript" });
            break;
        case ".css":
            res.writeHead(200, { "Content-Type": "text/css" });
            break;
        case ".gif":
            res.writeHead(200, { "Content-Type": "image/gif" });
            break;
        case ".jpg":
            res.writeHead(200, { "Content-Type": "image/jpeg" });
            break;
        case ".png":
            res.writeHead(200, { "Content-Type": "image/png" });
            break;
        case ".pdf":
            res.writeHead(200, { "Content-Type": "application/pdf" });
            break;
        default:
            res.writeHead(200, { "Content-Type": "application/octet-stream" });
    }

    fs.readFile(pathname, function (err, data) {
        res.end(data);
    });
}