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
        var xmin = 1.0, xmax = 0.0, ymin = 1.0, ymax = 0.0;

        var clusterPerIsland = Math.ceil(n_clusters / n_islands);
        var lengthPerSegment = _(this.nodes).countBy(   // # instance w/i one island
            function(n) { return Math.floor(n.cluster / clusterPerIsland); }
        ); console.log(lengthPerSegment);

        var checkpoint = 0;
        for (var seg in lengthPerSegment) {
            var offset = this.islands[n_islands][seg] / degree;
            var length = lengthPerSegment[seg];
            var span = (1 / degree) / (length - 1);
            for (var i = 0; i < length; i++) {
                var xy = degree == 7 ?
                    gosper.index2coord7(span*i+offset, order) :
                    gosper.index2coord19(span*i+offset, order);

                xmin = xmin > xy[0] ? xy[0] : xmin;
                xmax = xmax < xy[0] ? xy[0] : xmax;
                ymin = ymin > xy[1] ? xy[1] : ymin;
                ymax = ymax < xy[1] ? xy[1] : ymax;

                _(this.nodes[checkpoint+i]).extend({x: xy[0], y: xy[1]});
                this.alias[this.nodes[checkpoint+i].name] = checkpoint+i;
            }
            checkpoint += length;
        }

        xmin -= 0.01; ymin -= 0.01; xmax += 0.01; ymax += 0.01;  // margin
        var xs = xmax - xmin, ys = ymax - ymin;
        for (i = 0; i < this.nodes.length; i++) {
            this.nodes[i].x = (this.nodes[i].x - xmin) / xs;
            this.nodes[i].y = (this.nodes[i].y - ymin) / ys;
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