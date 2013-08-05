var _ = require('lodash');

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
var wsClient = new WebSocket('ws://169.237.10.208:4000/'); {
    wsClient.on('open', function() {
        leap.loop(function(frame) {
            var hands = frame.hands;
            var numHands = hands === undefined ? 0 : hands.length;
            if (numHands > 0) {
                for (var hid = 0; hid < numHands; hid++) {
                    var fingers = hands[hid].fingers;
                    var numFingers = fingers === undefined ? 0 : fingers.length;
                    if (numFingers > 0) {
                        for (var fid = 0; fid < numFingers; fid++) {
                            delete fingers[fid].frame;  // remove circular ref
                        }
                    }

                    delete hands[hid].frame;
                    delete hands[hid].pointables;
                    delete hands[hid].tools;

                    _.assign(hands[hid], { 'historyIdx': frame.historyIdx });
                }
                wsClient.send(JSON.stringify(hands));
            }
        });
    });
    wsClient.on('error', function(err) {
        console.log(err);
    });
}