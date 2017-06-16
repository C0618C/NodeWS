var express = require('express')
var app = express()
 
app.get('/', function (req, res) {
  res.send('Hello World')
});

app.get('/login', function (req, res) {
    console.log(req["a"]);
  res.send(JSON.stringify({a:"",bU:"cs"}))
});
 
 
app.listen(3000);