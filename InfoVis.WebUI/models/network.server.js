var _ = require("underscore");
var gosper = require("./gosper.server.js").gosper;

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
    preprocess: function(degree, order) {
        var segLengths = {};
        for (var k = 0; k < this.nodes.length; k++) {
            var g = this.nodes[k].group;
            if (g in segLengths) {
                segLengths[g]++;
            } else {
                segLengths[g] = 1;
            }
        }
        console.log(segLengths);
        var global_id = 0;
        for (var seg in segLengths) {
            var offset = seg / degree;
            var length = segLengths[seg];
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
        console.log("preprocess done");
    },
    reset: function() {
        this.edges = [];
        this.nodes = [];
    }
};