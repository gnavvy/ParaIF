var _ = require("underscore");

exports.dataset = {
  data: [],
  boundary: [800,500],
	getData: function() {
		return this.data;
	},
  getLabels: function() {
    return _.map(this.data, function(d) { return d.label; });
  },
	getSize: function() {
		return this.data.length;
	},
  init: function() {
    this.data = [];
    // this.add(0, 0, 0);
  },
  add: function(x, y, g) {
    var entry = {
      id: _.uniqueId(),
      x: x || _.random(10,this.boundary[0]-10),
      y: y || _.random(10,this.boundary[1]-10),
      value: 8,
      group: g
    };
    this.data.push(entry);
    return entry;
  },
  remove: function(id) {
    for (var i = 0; i < this.data.length; i++) {
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
  shuffle: function() {
    for (var i = 0; i< this.data.length; i++) {
      this.data[i].x = _.random(10,this.boundary[0]-10);
      this.data[i].y = _.random(10,this.boundary[1]-10);
    }
  }
};