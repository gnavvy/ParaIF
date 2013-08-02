// Leap hand model
var Hand = require('./node_modules/leapjs/lib/hand.js');

// Leap service setup
var Leap = require('./node_modules/leapjs/lib/index.js');
var leap = new Leap.Controller(); {
    leap.on('ready',                function() { console.log("ready"); });
    leap.on('connect',              function() { console.log("connect"); });
    leap.on('disconnect',           function() { console.log("disconnect"); });
    leap.on('focus',                function() { console.log("focus"); });
    leap.on('blur',                 function() { console.log("blur"); });
    leap.on('deviceConnected',      function() { console.log("deviceConnected"); });
    leap.on('deviceDisconnected',   function() { console.log("deviceDisconnected"); });
    leap.connect();
}

// WebSocket setup
var WebSocket = require('ws');
var wsClient = new WebSocket('ws://localhost:4000/'); {
    wsClient.on('open', function() {
        leap.loop(function(frame) {
            var numFingers = frame.fingers === undefined ? 0 : frame.fingers.length;
            if (numFingers > 0) {
                for (var i = 0; i < numFingers; i++) {
                    delete frame.fingers[i].frame;  // remove circular ref
                }
                wsClient.send(JSON.stringify(frame.fingers));
            }
        });
    });
    wsClient.on('error', function(err) {
        console.log(err);
    });
}