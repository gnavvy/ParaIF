var _ = require("underscore");
    _.str = require('underscore.string');
var gosper = require("./gosper.server.js").gosper;

exports.network = {
    nodes: [],
    edges: [],
    paths: [],
    alias: {},  // alias[node.name] = index
    islands : {
        12: [1, 2, 3, 18, 17, 16, 15, 14, 13, 12, 11, 0],
        6: [0, 1, 6, 4, 5, 3]
    },
    getNodes: function() {
        console.log("#nodes: " + this.nodes.length);
        return this.nodes;
    },
    getEdges: function() {
        console.log("#edges: " + this.edges.length);
        return this.edges;
    },
    getPaths: function() {
        return this.paths.join();
    },
    setNodes: function(nodes) {
        this.nodes = nodes;
    },
    setEdges: function(edges) {
        this.edges = edges;
    },
    preprocess: function(degree, order, n_cluster) {
        var lengthPerSegment = _(this.nodes).countBy(
            function(n) { return n.group; }
        );

        var checkpoint = 0;
        for (var seg in lengthPerSegment) {
            var offset = this.islands[n_cluster][seg] / degree;
            var length = lengthPerSegment[seg];
            var span = (1 / degree) / (length - 1);
            for (var i = 0; i < length; i++) {
                var xy = degree == 7 ? gosper.index2coord7(span * i + offset, order) :
                                       gosper.index2coord19(span * i + offset, order);
                _(this.nodes[checkpoint + i]).extend({
                    x : xy[0] * 750 + 180,
                    y : xy[1] * 750 + 120
                });
                this.alias[this.nodes[checkpoint + i].name] = checkpoint + i;
            }
            checkpoint += length;
        }
//        console.log(this.nodes);
        for (var j = 0; j < this.edges.length; j++) {
            var e = this.edges[j];
            var src = _(this.nodes).find(function(n) { return n.name == e.source; });
            var tgt = _(this.nodes).find(function(n) { return n.name == e.target; });
            var path = _.str.sprintf("M %.2f %.2f L %.2f %.2f ", src.x, src.y, tgt.x, tgt.y);
            this.paths.push(path);
            this.edges[j].source = this.alias[this.edges[j].source];
            this.edges[j].target = this.alias[this.edges[j].target];
        }



    },
    reset: function() {
        this.edges = [];
        this.nodes = [];
    }
};