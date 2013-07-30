var PORT = 4000;
var HOST = '127.0.0.1';

function JointFactory() {
    JointFactory.prototype.defaultClass = function(options) {
        this.x = options.x || 0.0;
        this.y = options.y || 0.0;
        this.z = options.z || 0.0;
        this.s = options.s || 0;
    };
    JointFactory.prototype.createJoint = function (options) {
        return new this.defaultClass(options);
    }
}

var kinect = require('dgram').createSocket('udp4'); {
    var handFactory = new JointFactory();
    setInterval(function() {
        var left = handFactory.createJoint({
            x: Math.random() * 0.1 - 0.1,
            y: Math.random() * 0.2 + 0.1,
            z: Math.random() * 0.2 + 0.8,
            s: 0
        });

        var right = handFactory.createJoint({
            x: Math.random() * 0.1,
            y: Math.random() * 0.2 + 0.1,
            z: Math.random() * 0.2 + 0.8,
            s: 1
        });

        console.log(left);
        console.log(right);

        var buffer = new Buffer(JSON.stringify([left, right]));
        kinect.send(buffer, 0, buffer.length, PORT, HOST, function(err, bytes) {
            if (err) throw err;
            console.log('UDP message sent to ' + HOST +':'+ PORT);
        });
    }, 5000);
}