var express = require('express');
var routes = require('./routes');
var http = require('http');
var app = module.exports = express();

app.configure(function () {
    app.set('port', 3000 || process.env.PORT);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(app.router);
    app.get('/', routes.index);
    app.get('/critique', routes.critique);
    app.get('/chris', routes.chris);
    app.get('/svm', routes.svm);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.static(__dirname + '/views'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

var server = http.createServer(app);
var clients = require('now').initialize(server).now;
var graph = require('./models/graph.server.js').graph;
var gosper = require('./models/gosper.server.js').gosper;
var host = 'gnavvy.cs.ucdavis.edu', port = 4000;

clients.start = function () {
    this.now.reset(7, 4);
};

clients.reset = function (degree, order) {
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
                    graph.preprocess(degree, order, 6);
                    clients.setNodes(graph.getNodes());
                    clients.setEdges(graph.getEdges());
                    clients.update();
                });
            });
        });
    });
};

server.listen(app.get('port'), function () {    // go!
    console.log("Express server listening on port " + app.get('port'));
});