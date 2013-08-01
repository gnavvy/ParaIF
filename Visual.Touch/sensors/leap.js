// Leap service setup
var Leap = require('../node_modules/leapjs/lib/index.js');
var leap = new Leap.Controller(); {
    leap.on('ready',                function() { console.log("ready"); });
    leap.on('connect',              function() { console.log("connect"); });
    leap.on('disconnect',           function() { console.log("disconnect"); });
    leap.on('focus',                function() { console.log("focus"); });
    leap.on('blur',                 function() { console.log("blur"); });
    leap.on('deviceConnected',      function() { console.log("deviceConnected"); });
    leap.on('deviceDisconnected',   function() { console.log("deviceDisconnected"); });
    leap.connect();
    console.log("\nWaiting for device to connect...");
}

// Websocket setup
var WebSocket = require('ws');
var wsClient = new WebSocket('ws://localhost:4000/'); {
    wsClient.on('open', function() {
        leap.loop(function(frame) {
            var numHands = frame.hands === undefined ? 0 : frame.hands.length;
            if (numHands > 0) {
                wsClient.send(JSON.stringify(frame.hands[0].stabilizedPalmPosition));
            }
        });
    });
    wsClient.on('error', function(err) {
        console.log(err);
    });
}