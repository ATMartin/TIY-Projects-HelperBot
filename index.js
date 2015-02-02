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

// Bot Functions
var botName = "HelperBot";
var botInit = "#!";
var regexPics = /([^\s]+(\.(gif|jpg|jpeg|png)))/gi;
var mostRecentID;

var filterCommands = function(message) {
  console.log(message);
  if (message.split(' ')[0] === botInit) {
    var command = message.split(' ')[1];
    console.log("Command received for " + botName + ": '" + command + "'!");
    if (regexPics.test(command)) { postMessage(imageEncode(command)); }     
  }
  return message;
}

var imageEncode = function(string) {
  return string
         .replace('"', '')
         .replace(/([^\s]+(\.(gif|jpg|jpeg|png)))/gi, '<img src="$&">');
}

var postMessage = function(message) {
  var data = {
    "username": botName,
    "message": message,
    "createdAt": Date.now().toString(),
    "appName": "After12"
  };

  var dataString = JSON.stringify(data);
  
  var headers = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(dataString)
  };

  var options = {
    host: 'tiny-pizza-server.herokuapp.com',
    path: '/collections/greenville-chats',
    method: 'POST',
    headers: headers
  };

  var req = http.request(options, function(res) {
    var resString = '';
    res.setEncoding('utf-8'); 
    res.on('data', function(chunk) { resString += chunk; });
    res.on('end', function() {
      console.log(resString);
    }); 
  });

  req.on('error', function(e) { console.log(e); });
  req.write(dataString);
  req.end();
};

var wss = new wsServer({server: server});
console.log("Created WS Server");

wss.on('connection', function(ws) {
  // var id = setInterval(function() {
  //   ws.send(JSON.stringify(new Date()), function() { })
  // }, 1000); 
  // var mostRecentID = '';
  var msgs = setInterval(function() {
    http.get(remoteUrl, function(res) {
    var body = '';
    res.on('data', function(chunk) { body += chunk; })
    res.on('end', function() {
        var latest = JSON.parse(body)[0];
        if (latest["_id"] === mostRecentID) { 
          return; 
          } else {
          filterCommands(latest["message"]);
          ws.send(JSON.stringify(latest), function() {});
          mostRecentID = latest["_id"];
        };
        // var regex = new RegExp("\/http\:\/\/\\S\*\(\\.\(gif\)\)\/gi");
        // var filters = JSON.stringify(latest["message"]).replace(/([^\s]+(\.(gif)))/gi, "<img src='$&'>").replace('"', '');
        // var filters = /([^\s]+(\.(gif)))/gi.test(JSON.stringify(latest["message"])).toString();
        // ws.send(JSON.stringify(latest).replace(/http://\S*(\.(gif))\s/gi, "<img src='$&'>")), function() {} )});  
        // ws.send(filters, function() {});
      });
    });
  }, 1000);
  
  console.log("connection opened!");
  
  ws.on("close", function() {
    console.log("close");
    clearInterval(msgs);  
  }); 
});

app.get("/kickstart", function(req, res) {
  var botPoller = setInterval(function() {
    http.get(remoteUrl, function(response) {
      var body = '';
      response.on('data', function(chunk) { body += chunk; });
      response.on('end', function() {
        var latest = JSON.parse(body)[0];
        if (latest["_id"] === mostRecentID) { return; }
        else {
          filterCommands(latest["message"]);
          mostRecentID = latest["_id"];
        };
      });  
    }); 
  });
  res.send("HelperBot is GOOOOOOOO!"); 
});

app.get("/diediedie", function(req, res) {
  clearInterval(botPoller);
  res.send("This HelperBot is NO MORE! It has CEASED to BE!");  
});
