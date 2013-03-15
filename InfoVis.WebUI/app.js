var express = require('express');
var routes = require('./routes');
var http = require('http');
var app = module.exports = express();

app.configure(function () {
    app.set('port', 3000 || process.env.PORT);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(app.router);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.static(__dirname + '/views'));
});

app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);
app.get('/critique', routes.critique);
app.get('/chris', routes.chris);
app.get('/svm', routes.svm);

var server = http.createServer(app);
var clients = require('now').initialize(server).now;
var network = require('./models/network.server.js').network;
var gosper = require('./models/gosper.server.js').gosper;

clients.start = function () {
    this.now.reset(19, 4);
};

clients.reset = function (degree, order) {
    console.log('reset with degree: ' + degree + ', order: ' + order);
    gosper.init(degree);
    var opt_node = { host: 'gnavvy.cs.ucdavis.edu', port: 4000, path: '/getNodes' };
    http.get(opt_node, function (res) {
        var data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            network.setNodes(JSON.parse(data));
//            console.log('getNodes: ' + network.getNodes());
            // get edges after nodes are received
            var opt_edge = { host: 'gnavvy.cs.ucdavis.edu', port: 4000, path: '/getEdges' };
            http.get(opt_edge, function (res) {
                data = '';
                res.on('data', function (chunk) {
                    data += chunk;
                });
                res.on('end', function () {
                    network.setEdges(JSON.parse(data));
                    network.preprocess(degree, order, 12);
                    clients.setNodes(network.getNodes());
                    clients.setEdges(network.getEdges());
                    clients.setPaths(network.getPaths());
                    clients.update();
                });
            });
        });
    });
};

// go!
server.listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});