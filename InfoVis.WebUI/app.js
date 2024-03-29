var express = require('express');
var routes = require('./routes');
var http = require('http');

var graph = require('./models/graph.server.js').graph;
var gosper = require('./models/gosper.server.js').gosper;
var host = '127.0.0.1', port = 4000;

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

var server = http.createServer(app); {
    server.listen(app.get('port'), function () {
        console.log("Express server listening on port " + app.get('port'));
    });
}

var clients = require('now').initialize(server).now; {
    clients.start = function () {
        this.now.reset(7, 4, 6);
    };

    clients.reset = function (degree, order, n_clusters) {
        console.log('reset with degree: ' + degree + ', order: ' + order);
        graph.reset();
        gosper.init(degree, order);
        var opt_node = { host: host, port: port, path: '/getNodes' };
        http.get(opt_node, function (res) {
            var data = '';
            res.on('data', function (chunk) { data += chunk; });
            res.on('end', function () {
                graph.setNodes(JSON.parse(data));
                var opt_edge = { host: host, port: port, path: '/getEdges' };
                http.get(opt_edge, function (res) {
                    data = '';
                    res.on('data', function (chunk) { data += chunk; });
                    res.on('end', function () {
                        graph.setEdges(JSON.parse(data));
                        graph.preprocess(degree, order, n_clusters);
                        clients.setNodes(graph.getNodes());
                        clients.setEdges(graph.getEdges());
                        clients.setDegree(degree);
                        clients.update();
                    });
                });
            });
        });
    };
}