var _ = require("underscore");
    _.str = require('underscore.string');
var gosper = require("./gosper.server.js").gosper;

exports.graph = {
    nodes: [],
    edges: [],
    alias: {},  // alias[node.name] = index
    islands : {
        12: [1, 2, 3, 18, 17, 16, 15, 14, 13, 12, 11, 0],
        6: [0, 1, 6, 4, 5, 3]
    },
    getNodes: function() {
        console.log("# nodes: " + this.nodes.length);
        return this.nodes;
    },
    getEdges: function() {
        console.log("# edges: " + this.edges.length);
        return this.edges;
    },
    setNodes: function(nodes) {
        this.nodes = nodes;
    },
    setEdges: function(edges) {
        this.edges = edges;
    },
    preprocess: function(degree, order, n_clusters) {
        var n_islands = degree == 7 ? 6 : 12;   // # gosper island to use
//        var xmin = 1.0, xmax = 0.0, ymin = 1.0, ymax = 0.0;

        var clusterPerIsland = Math.ceil(n_clusters / n_islands);
        var lengthPerSegment = _(this.nodes).countBy(   // # instance w/i one island
            function(n) { return Math.floor(n.cluster / clusterPerIsland); }
        ); console.log(lengthPerSegment);

        var checkpoint = 0;
        for (var seg in lengthPerSegment) {
            var length = lengthPerSegment[seg];
            var span = (1.0 / degree) / (length - 1);
            for (var i = 0; i < length; i++) {
                var xy = [];
                for (var j = 0; j <= degree; j++) {
                    if (j == degree) {
                        xy[j] = degree == 7 ?
                            gosper.index2coord7(span*i, order - 1) :
                            gosper.index2coord19(span*i, order - 1);
                        continue;
                    }
                    var offset = j / degree;
                    xy[j] = degree == 7 ?
                        gosper.index2coord7(span*i+offset, order) :
                        gosper.index2coord19(span*i+offset, order);
                }
                _(this.nodes[checkpoint+i]).extend({positions: xy});
                this.alias[this.nodes[checkpoint+i].name] = checkpoint+i;
            }
            checkpoint += length;
        }
        for (i = 0; i < this.edges.length; i++) {
            this.edges[i].source = this.alias[this.edges[i].source];
            this.edges[i].target = this.alias[this.edges[i].target];
        }
    },
    reset: function() {
        this.edges = [];
        this.nodes = [];
    }
};