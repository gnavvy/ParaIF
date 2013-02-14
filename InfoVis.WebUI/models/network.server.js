var _ = require("underscore");

exports.network = {
  nodes: [],
  edges: [],
  alias: {},
  getNodes: function() {
    return this.nodes;
  },
  getEdges: function() {
    return this.edges;
  },
  setNodes: function(nodes) {
    this.nodes = nodes;
    // console.log(nodes)
  },
  setEdges: function(edges) {
    this.edges = edges;
    // console.log(edges)
  },
  normalize: function() {
    for (var i = 0; i < this.nodes.length; i++) {
      this.alias[this.nodes[i].name] = i;
    }
    for (var i = 0; i < this.edges.length; i++) {
      // this.edges[i].source = _.indexOf(this.nodes, this.edges[i].source);
      // this.edges[i].target = _.indexOf(this.nodes, this.edges[i].target);
      this.edges[i].source = this.alias[this.edges[i].source];
      this.edges[i].target = this.alias[this.edges[i].target];
    }
    console.log(this.edges);
  },
  getNode: function(alias) {
    // return this.alias[]
  },
  reset: function() {
    this.edges = [];
    this.nodes = [];
  }
};