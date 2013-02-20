var _ = require("underscore");

var gosper = {
    sqrt3half: 0.0, a: 0.0, h: 0.0, d: 0.0, data: []
};

gosper.init = function(degree) {
    this.sqrt3half = Math.sqrt(3) / 2;
    this.a = 1.0 / Math.sqrt(7);      // length of flag triangle
    this.h = this.a * this.sqrt3half; // height of flag triangle
    this.d = Math.sqrt(2.5 * 2.5 * this.a * this.a + this.h * this.h);
};

gosper.getData = function() {
    this.data = _.map(_.range(0.0, 1.0, 0.0001), function(index) {
        return gosper.index2coord(index, degree);
    });
    return this.data;
};

gosper.index2coord = function(index, depth) {
    var seg = parseInt(Math.floor(Math.abs(index) * 7));
    var off = 7 * index - seg;
    var x_out = 0.0, y_out = 0.0;

    if (depth <= 1) {
        if (seg == 0) {
            x_out = this.a * off;
            y_out = 0.0;
        } else if (seg == 1) {
            x_out = this.a * (1 + 0.5 * off);
            y_out = this.h * off;
        } else if (seg == 2) {
            x_out = this.a * (1.5 - off);
            y_out = this.h;
        } else if (seg == 3) {
            x_out = this.a * (0.5 - 0.5 * off);
            y_out = this.h * (1 + off);
        } else if (seg == 4) {
            x_out = this.a * off;
            y_out = this.h * 2;
        } else if (seg == 5) {
            x_out = this.a * (1 + off);
            y_out = this.h * 2;
        } else {
            x_out = this.a * (2 + 0.5 * off);
            y_out = this.h * (2 - off);
        }
    } else {
        var xy, xx, yy;
        if (seg == 0) {
            xy = this.index2coord(off, depth - 1);
            x_out = (xy[0] * 2.5 * this.a + xy[1] * this.h) / this.d * this.a;
            y_out = (xy[1] * 2.5 * this.a - xy[0] * this.h) / this.d * this.a;
        } else if (seg == 1) {
            xy = this.index2coord(1.0 - off, depth - 1);
            xx = (xy[0] * 2.5 * this.a + xy[1] * this.h) / this.d * this.a;
            yy = (xy[1] * 2.5 * this.a - xy[0] * this.h) / this.d * this.a;
            x_out = -xx * 0.5 + yy * this.sqrt3half + 1.5 * this.a;
            y_out = -yy * 0.5 - xx * this.sqrt3half + this.h;
        } else if (seg == 2) {
            xy = this.index2coord(1.0 - off, depth - 1);
            x_out = (xy[0] * 2.5 * this.a + xy[1] * this.h) / this.d * this.a + 0.5 * this.a;
            y_out = (xy[1] * 2.5 * this.a - xy[0] * this.h) / this.d * this.a + this.h;
        } else if (seg == 3) {
            xy = this.index2coord(off, depth - 1);
            xx = (xy[0] * 2.5 * this.a + xy[1] * this.h) / this.d * this.a;
            yy = (xy[1] * 2.5 * this.a - xy[0] * this.h) / this.d * this.a;
            x_out = -xx * 0.5 - yy * this.sqrt3half + 0.5 * this.a;
            y_out = -yy * 0.5 + xx * this.sqrt3half + this.h;
        } else if (seg == 4) {
            xy = this.index2coord(off, depth - 1);
            x_out = (xy[0] * 2.5 * this.a + xy[1] * this.h) / this.d * this.a;
            y_out = (xy[1] * 2.5 * this.a - xy[0] * this.h) / this.d * this.a + 2 * this.h;
        } else if (seg == 5) {
            xy = this.index2coord(off, depth - 1);
            x_out = (xy[0] * 2.5 * this.a + xy[1] * this.h) / this.d * this.a + this.a;
            y_out = (xy[1] * 2.5 * this.a - xy[0] * this.h) / this.d * this.a + 2 * this.h;
        } else {
            xy = this.index2coord(1.0 - off, depth - 1);
            xx = (xy[0] * 2.5 * this.a + xy[1] * this.h) / this.d * this.a;
            yy = (xy[1] * 2.5 * this.a - xy[0] * this.h) / this.d * this.a;
            x_out = -xx * 0.5 - yy * this.sqrt3half + 2.5 * this.a;
            y_out = -yy * 0.5 + xx * this.sqrt3half + this.h;
        }
    }

    return [x_out, y_out];
};

exports.gosper = gosper;