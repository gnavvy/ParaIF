var _ = require("underscore");

var gosper = {
    s3h: Math.sqrt(3) / 2.0,
    a: 0.0, h: 0.0,
//    c: [], o: 0, // c: center o: order
    dir7: [0, 1, 1, 0, 0, 0, 1],
    dir19: [0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1],
    data: []
};

gosper.init = function(degree, order) {
    this.a = 1.0 / Math.sqrt(degree);   // length of flag triangle
    this.h = this.a * this.s3h;         // height of flag triangle
//    this.c = degree == 7 ? this.index2coord7(0.5, order)
//        : this.index2coord19(0.5, order);
};

gosper.index2coord19 = function(index, depth) {
    var seg = parseInt(Math.floor(Math.abs(index) * 19));
    var off = index * 19 - seg;
    if (depth == 1) {
        switch (seg) {
            case 0: 
                return [this.a * off, 0];
            case 1: return [this.a * (1 + off), 0];
            case 2: return [this.a * (2 + 0.5 * off), this.h * off];
            case 3: return [this.a * (2.5 + 0.5 * off), this.h * (1 + off)];
            case 4: return [this.a * (3 - 0.5 * off), this.h * (2 + off)];
            case 5: return [this.a * (2.5 - off), this.h * 3];
            case 6: return [this.a * (1.5 - off), this.h * 3];
            case 7: return [this.a * (0.5 + 0.5 * off), this.h * (3 - off)];
            case 8: return [this.a * (1 + off), this.h * 2];
            case 9: return [this.a * (2 - 0.5 * off), this.h * (2 - off)];
            case 10: return [this.a * (1.5 - off), this.h];
            case 11: return [this.a * (0.5 - 0.5 * off), this.h * (1 + off)];
            case 12: return [this.a * (-0.5 * off), this.h * (2 + off)];
            case 13: return [this.a * (-0.5 + 0.5 * off), this.h * (3 + off)];
            case 14: return [this.a * off, this.h * 4];
            case 15: return [this.a * (1 + off), this.h * 4];
            case 16: return [this.a * (2 + off), this.h * 4];
            case 17: return [this.a * (3 + 0.5 * off), this.h * (4 - off)];
            default: return [this.a * (3.5 + 0.5 * off), this.h * (3 - off)];
        }
    } else {
        var off_ = this.dir19[seg] == 0 ? off : 1.0 - off;
        var xy = this.index2coord19(off_, depth - 1);
        var xx = (xy[0] * this.a * 4 + xy[1] * this.h * 2) * this.a;
        var yy = (xy[1] * this.a * 4 - xy[0] * this.h * 2) * this.a;
        switch (seg) {
            case 0: return [xx, yy];
            case 1: return [xx + this.a, yy];
            case 2: return [-xx * 0.5 + yy * this.s3h + this.a * 2.5, -yy * 0.5 - xx * this.s3h + this.h];
            case 3: return [-xx * 0.5 + yy * this.s3h + this.a * 3.0, -yy * 0.5 - xx * this.s3h + this.h * 2];
            case 4: return [-xx * 0.5 - yy * this.s3h + this.a * 3.0, -yy * 0.5 + xx * this.s3h + this.h * 2];
            case 5: return [xx + this.a * 1.5, yy + this.h * 3];
            case 6: return [xx + this.a * 0.5, yy + this.h * 3];
            case 7: return [-xx * 0.5 - yy * this.s3h + this.a, -yy * 0.5 + xx * this.s3h + this.h * 2];
            case 8: return [xx + this.a, yy + this.h * 2];
            case 9: return [-xx * 0.5 + yy * this.s3h + this.a * 2.0, -yy * 0.5 - xx * this.s3h + this.h * 2];
            case 10: return [xx + this.a * 0.5, yy + this.h];
            case 11: return [-xx * 0.5 - yy * this.s3h + this.a * 0.5, -yy * 0.5 + xx * this.s3h + this.h];
            case 12: return [-xx * 0.5 - yy * this.s3h, -yy * 0.5 + xx * this.s3h + this.h * 2];
            case 13: return [-xx * 0.5 + yy * this.s3h, -yy * 0.5 - xx * this.s3h + this.h * 4];
            case 14: return [xx, yy + this.h * 4];
            case 15: return [xx + this.a, yy + this.h * 4];
            case 16: return [xx + this.a * 2.0, yy + this.h * 4];
            case 17: return [-xx * 0.5 - yy * this.s3h + this.a * 3.5, -yy * 0.5 + xx * this.s3h + this.h * 3];
            default: return [-xx * 0.5 - yy * this.s3h + this.a * 4.0, -yy * 0.5 + xx * this.s3h + this.h * 2];
        }
    }
};

gosper.index2coord7 = function(index, depth) {
    var seg = parseInt(Math.floor(Math.abs(index) * 7));
    var off = index * 7 - seg;
    if (depth == 1) {
        switch (seg) {
            case 0: return [this.a * off, 0];
            case 1: return [this.a * (1 + 0.5 * off), this.h * off];
            case 2: return [this.a * (1.5 - off), this.h];
            case 3: return [this.a * (0.5 - 0.5 * off), this.h * (1 + off)];
            case 4: return [this.a * off, this.h * 2];
            case 5: return [this.a * (1 + off), this.h * 2];
            default: return [this.a * (2 + 0.5 * off), this.h * (2 - off)];
        }
    } else {
        var off_ = this.dir7[seg] == 0 ? off : 1.0 - off;
        var xy = this.index2coord7(off_, depth - 1);
        var xx = (xy[0] * 2.5 * this.a + xy[1] * this.h) * this.a;
        var yy = (xy[1] * 2.5 * this.a - xy[0] * this.h) * this.a;
        switch (seg) {
            case 0: return [xx, yy];
            case 1: return [-xx * 0.5 + yy * this.s3h + 1.5 * this.a, -yy * 0.5 - xx * this.s3h + this.h];
            case 2: return [xx + 0.5 * this.a, yy + this.h];
            case 3: return [-xx * 0.5 - yy * this.s3h + 0.5 * this.a, -yy * 0.5 + xx * this.s3h + this.h];
            case 4: return [xx, yy + 2 * this.h];
            case 5: return [xx + this.a, yy + 2 * this.h];
            default: return [-xx * 0.5 - yy * this.s3h + 2.5 * this.a, -yy * 0.5 + xx * this.s3h + this.h];
        }
    }
};

exports.gosper = gosper;