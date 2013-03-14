var _ = require("underscore");
var gosper = require("./gosper.server.js").gosper;

exports.network = {
    nodes: [],
    edges: [],
    alias: {},
    islands : { 12: [1, 2, 3, 18, 17, 16, 15, 14, 13, 12, 11, 0]},
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
    preprocess: function(degree, order, n_cluster) {
//        var clusterPerIsland = parseInt(Math.ceil(n_cluster/degree));
        var lengthPerSegment = _.countBy(this.nodes, function(n) {
            return n.group;
        });
        console.log(lengthPerSegment);
//        console.log('clusterPerIsland: ' + clusterPerIsland);
        var global_id = 0;
        for (var seg in lengthPerSegment) {
            var offset = this.islands[n_cluster][seg] / degree;
//            if (seg >= 2) offset += 1 / degree;
//            if (seg >= 4) offset += 7 / degree;
            var length = lengthPerSegment[seg];
            var span = (1 / degree) / (length - 1);
            for (var id = 0; id < length; id++) {
                var xy = degree == 7 ?
                    gosper.index2coord7(span * id + offset, order) :
                    gosper.index2coord19(span * id + offset, order);
                _.extend(this.nodes[global_id + id], {
                    x : xy[0] * 750 + 200,
                    y : xy[1] * 750 + 120
                });
                this.alias[this.nodes[global_id + id].name] = global_id + id;
            }
            global_id += length;
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