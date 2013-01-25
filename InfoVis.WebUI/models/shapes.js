var _ = require('underscore');

// the circle model
exports.circle = {
	NUM_CIRCLES: 10,
	data: [],
	getData: function() {
		return this.data;
	},
	getSize: function() {
		return this.data.length;
	},
    add: function(x, y) {
        var entry = {
            id: _.uniqueId(),
            x: x || (700 - Math.random()*600)|0,
            y: y || (400 - Math.random()*300)|0,
            r: (30 + Math.random()*10)|0,
            color: ["green","orange","blue","red"][Math.random()*4|0],
            opacity: ((20 + Math.random()*40)|0)/100
        };
        this.data.push(entry);
        return entry;
    },
    remove: function(id) {
        for (var i=0; i<this.data.length; i++) {
            if (this.data[i].id == id) {
                this.data.splice(i, 1);
                return id;
            }
        }
        return -1;
    },
    removeRandom: function() {
        if (this.data.length) {
            var id = this.data[Math.random()*this.data.length|0].id;
            return this.remove(id);
        } else {
            return -1;
        }
    },
    init: function() {
        this.data = [];
        for (var i=0; i<this.NUM_CIRCLES; i++) {
            this.add(0, 0);
        }
    },
    shuffle: function() {
        for (var i=0; i<this.data.length; i++) {
            this.data[i].x = (700 - Math.random()*600)|0;
            this.data[i].y = (400 - Math.random()*300)|0;
        }
    },
    translate: function(i, x, y) {
        this.data[i].x = x;
        this.data[i].y = y;
    },
    createEntry: function(x, y) {
        var entry = {
            id: 0,
            x: x,
            y: y,
            r: (30 + Math.random()*40)|0,
            color: ["red","orange","blue","green"][Math.random()*4|0],
            opacity: ((20 + Math.random()*40)|0)/100
        };
        return entry;
    }
};

