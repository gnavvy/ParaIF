var express = require('express');
var routes = require('./routes');
var http = require('http');
var exec = require('child_process').exec;
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
    var startingClient = this.now;
    startingClient.reset();
};

clients.reset = function () {
    console.log('reset');
    var opt_node = { host: 'gnavvy.cs.ucdavis.edu', port: 4000, path: '/getNodes' };
    var req_node = http.get(opt_node, function (res) {
        var data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            network.setNodes(JSON.parse(data));
            // get edges after nodes are received
            var opt_edge = { host: 'gnavvy.cs.ucdavis.edu', port: 4000, path: '/getEdges' };
            var req_edge = http.get(opt_edge, function (res) {
                data = '';
                res.on('data', function (chunk) {
                    data += chunk;
                });
                res.on('end', function () {
                    network.setEdges(JSON.parse(data));
                    network.preprocess();
                    clients.setNodes(network.getNodes());
                    clients.setEdges(network.getEdges());
                });
            });
        });
    });
    gosper.init(4);
//    clients.setAuxil(gosper.getData());
};

// go!
server.listen(app.get('port'), function () {
//    console.log("Starting Cherry Server");
//    var cherry = exec('python ./core/cherry.py',
//        function (error, stdout, stderr) {
//            console.log(stdout);
//            console.log(stderr);
//            if (error != null) console.log(error);
//        }
//    );
    console.log("Express server listening on port " + app.get('port'));
});