var _ = require("underscore");
var g = require("./gosper.server.js").gosper;

exports.network = {
    nodes: [],
    edges: [],
    alias: {},
    getNodes: function() {
        console.log("#nodes: " + this.nodes.length);
        return this.nodes;
    },
    getEdges: function() {
        console.log("#edges: " + this.edges.length);
        return this.edges;
    },
    setNodes: function(nodes) {
        this.nodes = nodes;
    },
    setEdges: function(edges) {
        this.edges = edges;
    },
    preprocess: function() {
        var previous_group = 0;
        for (var i = 0; i < this.nodes.length; i++) {
            var d = this.nodes[i].group == previous_group ? 0.9 : 1.1;
            previous_group = this.nodes[i].group;
            var segLength = d / (this.nodes.length - 1);
            var xy = g.index2coord(segLength * i, 3);
            _.extend(this.nodes[i], {
                x : xy[0] * 750 + 160,
                y : xy[1] * 750 + 100
            });
            this.alias[this.nodes[i].name] = i;
        }
        for (var j = 0; j < this.edges.length; j++) {
            this.edges[j].source = this.alias[this.edges[j].source];
            this.edges[j].target = this.alias[this.edges[j].target];
        }
    },
    reset: function() {
        this.edges = [];
        this.nodes = [];
    }
};