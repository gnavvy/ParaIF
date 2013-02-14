var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , _ = require('underscore');
  _.str = require('underscore.string');
var app = module.exports = express();

app.configure( function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/views'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);
app.get('/critique', routes.critique);
app.get('/chris', routes.chris);
app.get('/svm', routes.svm);

var server = http.createServer(app);
var clients = require('now').initialize(server).now;
var network = require('./models/network.server').network;

clients.start = function() {
  var startingClient = this.now;
  clients.reset();
}

clients.reset = function() {
  console.log('get data start');
  
  var opt_node = { host: 'gnavvy.cs.ucdavis.edu', port: 4000, path: '/getNodes' }
  var req_node = http.get(opt_node, function (res) {
    var data = '';
    res.on('data', function(chunk) { data += chunk; });
    res.on('end', function() {
      network.setNodes(JSON.parse(data));
      console.log('get nodes done');

      // get edges after nodes are received
      var opt_edge = { host: 'gnavvy.cs.ucdavis.edu', port: 4000, path: '/getEdges' }
      var req_edge = http.get(opt_edge, function (res) {
        data = '';
        res.on('data', function(chunk) { data += chunk; });
        res.on('end', function() {
          network.setEdges(JSON.parse(data));               
          console.log('get edges done');

          network.normalize();
          clients.setNodes(network.getNodes());
          clients.setEdges(network.getEdges());
        });
      });
    });
  });
}

// go!
server.listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});