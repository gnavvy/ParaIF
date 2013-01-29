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
  // ,
  // preload: function() {
  //   var offset = 150;
  //   var np = 5;
  //   for (var i = 0; i < np; i++) {
  //     // top-left
  //     x = _.random(offset,this.boundary[0]/2-offset);
  //     y = _.random(offset,this.boundary[1]/2-offset);
  //     this.add(x, y, 0);
  //     // top-right
  //     x = _.random(this.boundary[0]/2+offset,this.boundary[0]-offset);
  //     y = _.random(offset,this.boundary[1]/2-offset);
  //     this.add(x, y, 1);
  //     // bottom-left
  //     x = _.random(offset,this.boundary[0]/2-offset);
  //     y = _.random(this.boundary[1]/2+offset,this.boundary[1]-offset);
  //     this.add(x, y, 2);
  //     // bottom-right
  //     x = _.random(this.boundary[0]/2+offset,this.boundary[0]-offset);
  //     y = _.random(this.boundary[1]/2+offset,this.boundary[1]-offset);
  //     this.add(x, y, 3);
  //   }
  // }
};

exports.maskset = {
  mask: [],
  boundary: [800,500],
  add: function(x, y, g) {
    var entry = {
      id: _.uniqueId(),
      x: x,
      y: y,
      value: 4,
      group: g
    };
    this.mask.push(entry);
    // return entry;
  },
  fillMask: function(labels) {
    console.log(labels);
    var index = 0;
    for (var y = 0; y < this.boundary[1]; y += 10) {
      for (var x = 0; x < this.boundary[0]; x += 10) {
        this.add(x, y, labels[index++]);
      }
    }
  },
  getMask: function() {
    return this.mask;
  }
};