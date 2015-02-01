var wsServer = require("ws").Server;
var http = require("http");
var express = require('express');
var app = express();

var port = process.env.PORT || 4567
var remoteUrl = "http://tiny-pizza-server.herokuapp.com/collections/greenville-chats/"

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/'));

var server = http.createServer(app);
server.listen(port);

console.log("http server listening on %d", port);

var wss = new wsServer({server: server});
console.log("Created WS Server");

wss.on('connection', function(ws) {
  // var id = setInterval(function() {
  //   ws.send(JSON.stringify(new Date()), function() { })
  // }, 1000); 

  var msgs = setInterval(function() {
    http.get(remoteUrl, function(res) {
    var body = '';
    res.on('data', function(chunk) { body += chunk; })
    res.on('end', function() {
        var latest = JSON.parse(body)[0];
        var regex = new RegExp("/http://\\S*(\\.(gif))\\s/gi");
        var filters = JSON.stringify(latest).replace(regex, "<img src='$&'>"); 
        // ws.send(JSON.stringify(latest).replace(/http://\S*(\.(gif))\s/gi, "<img src='$&'>")), function() {} )});  
        ws.send(filters, function() {})
      });
    });
  }, 1000);
  
  console.log("connection opened!");
  
  ws.on("close", function() {
    console.log("close");
    clearInterval(id);  
  }); 
});


