var express = require('express')
  , routes = require('./routes')
  , http = require('http');
var app = module.exports = express();

// Configuration
app.configure(function(){
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

var server = http.createServer(app);

// now.js setup
var clients = require('now').initialize(server).now;

// model
var dataset = require('./model.server').dataset;

clients.start = function() {
  // console.log('init random data: ' + dataset.getSize() + ' entries');
  var startingClient = this.now;
  startingClient.setData(dataset.getData());
}

clients.add = function(x, y, g) {
  var options = { 
    host: 'gnavvy.cs.ucdavis.edu', port: 4000, 
    path: '/add?entry=' + x + ',' + y + ',' + g
  }
  var callback = function (res) {
    res.on('data', function(chunk) {
      clients.log(""+chunk);
      console.log(""+chunk);
    }); 
  }

  var req = http.request(options, callback);
  req.end();

  var entry = dataset.add(x, y, g);
  clients.addData(entry);

  console.log('add new entry @ (' + x + ',' + y + ') of group: ' + g);
}

// clients.remove = function(id) {
//   dataset.remove(id);
//   clients.removeData(id);
//   console.log('remove entry: id = ' + id);
// }

// clients.shuffle = function() {
//   dataset.shuffle();
//   clients.setData(dataset.getData());
//   console.log('shuffle existing data');
// }

// clients.stream = function() {
//   var count = 10;
//   var streamEvent = function () {
//     setTimeout(function() {
//       clients.addData(dataset.add(0, 0));
//       clients.removeData(dataset.removeRandom());
//       if (--count) streamEvent();
//     }, 200);
//   };
//   streamEvent();
//   console.log('streaming new data entries');
// }

clients.reset = function() {
  dataset.init();
  clients.setData(dataset.getData());
  console.log('reset data');
}

clients.retrain = function() {
  var opt = { host: 'gnavvy.cs.ucdavis.edu', port: 4000, path: '/retrain' }
  var req = http.get(opt, function (res) {
    res.on('data', function(chunk) {
      clients.log(""+chunk);
      console.log(""+chunk);
    }); 
  })
  req.end();
}

dataset.init();

// go!
server.listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});