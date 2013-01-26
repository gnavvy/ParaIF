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
var everyone = require('now').initialize(server);

// model
var circle = require('./models/shapes').circle;

// call from client
everyone.now.start = function() {
  console.log('send data: ' + circle.getSize() + ' entries');
  var startingClient = this.now;
  startingClient.setData(new Date().getTime(), circle.getData());
}

everyone.now.add = function(x, y, group) {
  console.log('add object @ (' + x + ',' + y + ') of group: ' + group);
  var entry = circle.add(x, y, group);
  console.log(entry);
  everyone.now.addData(new Date().getTime(), entry);
}

everyone.now.remove = function(id) {
  console.log('remove object: id = ' + id);
  circle.remove(id);
  everyone.now.removeData(new Date().getTime(), id);
}

everyone.now.shuffle = function() {
  console.log('shuffle');
  circle.shuffle();
  everyone.now.setData(new Date().getTime(), circle.getData());
}

everyone.now.stream = function() {
  console.log('stream');
  var count = 100;
  var streamEvent = function () {
    setTimeout(function() {
      everyone.now.addData(new Date().getTime(), circle.add(0, 0));
      everyone.now.removeData(new Date().getTime(), circle.removeRandom());
      if (--count) { streamEvent(); }
    }, 200);
  };
  streamEvent();
}

everyone.now.reset = function() {
  console.log('reset');
  circle.init();
  everyone.now.setData(new Date().getTime(), circle.getData());
}

// everyone.now.setBoundary = function(x, y) {
//   circle.setBoundary(x, y);
// };

circle.init();

// go!
server.listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});