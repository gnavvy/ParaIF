var _ = require('underscore');

// the circle model
exports.circle = {
	NUM_CIRCLES: 5,
	// color_index: 0,
  data: [],
  boundary: [800,500],
	getData: function() {
		return this.data;
	},
	getSize: function() {
		return this.data.length;
	},
  // setBoundary: function(x, y) {
  //   this.boundary.push(x);
  //   this.boundary.push(y);
  // },
  // setColorIndex: function(index) {
  //   this.color_index = index;
  // },
  init: function() {
    this.data = [];
    for (var i=0; i<this.NUM_CIRCLES; i++) {
      this.add(0, 0, 0);
    }
  },
  add: function(x, y, group) {
    var entry = {
      id: _.uniqueId(),
      x: x || _.random(5,this.boundary[0]-5),
      y: y || _.random(5,this.boundary[1]-5),
      value: 10,
      group: group || 0
      // color: ["#38A8E8","#7AB23C","#E95A00","#D51E24"][this.color_index],
      // opacity: 1
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
  shuffle: function() {
    for (var i=0; i<this.data.length; i++) {
      this.data[i].x = _.random(5,this.boundary[0]-5);
      this.data[i].y = _.random(5,this.boundary[1]-5);
    }
  }
};

// svm training data set
// exports.training_data = {
//   data: [],
//   getData: function() {
//     return this.data;
//   },
//   getSize: function() {
//     return this.data.length;
//   },
//   add: function(x, y) {
//     var entry = {
//       id: _.uniqueId(),
//       x: x,
//       y: y,
//       r: 10,
//       color: ["green","orange","blue","red"][Math.random()*4|0],
//       opacity: ((20 + Math.random()*40)|0)/100
//     }
//     this.data.push(entry);
//     return entry;
//   }
// }