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
  reset: function() {
    this.data = [];
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
  }
};

exports.maskset = {
  mask: [],
  boundary: [800,500],
  add: function(x, y, g) {
    var entry = {
      id: _.uniqueId(),
      x: x,
      y: y,
      value: 8,
      group: g
    };
    this.mask.push(entry);
  },
  fillMask: function(labels) {
    var index = 0;
    for (var x = 0; x < this.boundary[0]; x += 10) {
      for (var y = 0; y < this.boundary[1]; y += 10) {
        this.add(x, y, labels[index++]);
      }
    }
  },
  getMask: function() {
    return this.mask;
  },
  reset: function() {
    this.mask = [];
  },
};

exports.graph = {
  nodes:[],
  edges:[]
};