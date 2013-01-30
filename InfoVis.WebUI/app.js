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
  app.use(express.static(__dirname + '/public'));
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
app.get('/d3js', routes.d3js);
app.get('/chris', routes.chris);

var server = http.createServer(app);
var clients = require('now').initialize(server).now;
var dataset = require('./model.server').dataset;
var maskset = require('./model.server').maskset;

clients.start = function() {
  var startingClient = this.now;
  startingClient.setData(dataset.getData());
}

clients.add = function(x, y, g) {
  var opt = { host: 'gnavvy.cs.ucdavis.edu', port: 4000,
    path: '/add?entry=' + x + ',' + y + ',' + g
  }
  var req = http.get(opt, function (res) {
    res.on('data', function(chunk) {
      clients.log(""+chunk);
      console.log(""+chunk);
    }); 
  }); req.end();

  var entry = dataset.add(x, y, g);
  clients.addData(entry);

  console.log('add new entry @ (' + x + ',' + y + ') of group: ' + g);
}

clients.reset = function() {
  var opt = { host: 'gnavvy.cs.ucdavis.edu', port: 4000, path: '/reset' }
  var req = http.get(opt, function (res) {
    res.on('data', function(chunk) {
      clients.log(""+chunk);
      console.log(""+chunk);
    }); 
  }); req.end();

  dataset.reset();
  maskset.reset();
  clients.setData(dataset.getData());
  clients.setMask(maskset.getMask());
  console.log('reset data');
}

clients.retrain = function() {
  var opt = { host: 'gnavvy.cs.ucdavis.edu', port: 4000, path: '/retrain' }
  var req = http.get(opt, function (res) {
    res.on('data', function(chunk) {
      clients.log(""+chunk);
      console.log(""+chunk);
    }); 
  }); req.end();
}

clients.test = function() {
  var opt = { host: 'gnavvy.cs.ucdavis.edu', port: 4000,
    path: '/testRect?rect=800,500'
  }
  var req = http.get(opt, function (res) {
    res.on('data', function(chunk) {
      var chars = _.str.words(chunk, ', ');
      var mask = _.map(chars, function (char) { return parseInt(char); })
      maskset.fillMask(mask);
      clients.setMask(maskset.getMask());
    }); 
  }); req.end();
}

clients.reset();

// go!
server.listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});