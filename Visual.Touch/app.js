var express = require('express');
var routes = require('./routes');
var app = module.exports = express(); {
    app.configure(function () {
        app.set('port', 3000 || process.env.PORT);
        app.set('views', __dirname + '/views');
        app.set('view engine', 'jade');
        app.use(app.router);
        app.get('/', routes.index);
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

var clients = require('now').initialize(server).now; {
    clients.start = function () {
        clients.update();
    };
}

// receive data from kinect via udp
var udp = require('dgram').createSocket('udp4'); {
    udp.bind(4000, '169.254.250.190');
    udp.on('listening', function () {
        console.log('UDP  server listening on port ' + udp.address().port);
    });
    udp.on('message', function (message, remote) {
        console.log(JSON.parse(message));
        clients.setHands(JSON.parse(message));
        console.log(remote.address + ':' + remote.port +' - ' + message);
    });
}