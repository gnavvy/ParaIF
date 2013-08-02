var express = require('express');
var app = module.exports = express(); {
    app.configure(function () {
        app.get('/', function(req, res) { res.render('index', { title: 'Visual Touch' }); });
        app.set('port', 3000 || process.env.PORT);
        app.set('views', __dirname + '/views');
        app.set('view engine', 'jade');
        app.use(app.router);
        app.use(express.favicon());
        app.use(express.logger('dev'));
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(express.static(__dirname + '/views'));
        app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    });
}

// http server
var server = require('http').createServer(app); {
    server.listen(app.get('port'), function () {
        console.log("HTTP server listening on port " + app.get('port'));
    });
}

// view client
var clients = require('now').initialize(server).now; {
    clients.start = function () {
        clients.update();
    };
}

//receive data via websocket
var WebSocketServer = require('ws').Server;
var wsServer = new WebSocketServer({ server: server, port: 4000 }); {
    wsServer.on('connection', function(ws) {
        console.log('WebSocket server listening on port ' + wsServer.port);
        ws.on('message', function(data) {
            console.log(ws._socket.remoteAddress);
            console.log(data);
        });
        ws.on('error', function(error) {
            console.log(error);
        });
        ws.on('close', function() {
            console.log('ws server closed.');
        });
    });
}