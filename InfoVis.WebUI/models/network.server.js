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
    preprocess: function(degree, order) {
        var length_per_group = {};
        for (var k = 0; k < this.nodes.length; k++) {
            var gid = this.nodes[k].group;
            if (gid in length_per_group) {
                length_per_group[gid]++;
            } else {
                length_per_group[gid] = 1;
            }
        }
//        console.log("length_per_group: " + length_per_group.length);
        for (var m = 0; m < this.nodes.length; m++) {
            gid = this.nodes[m].group;
            var segLength = (1.0 / degree) / (length_per_group[gid] - 1);
//            var segLength = (1.0 / degree) / (this.nodes.length - 1);
            var xy = degree == 7 ?
                g.index2coord7(segLength * m, order) :
                g.index2coord19(segLength * m, order);
            _.extend(this.nodes[m], {
                x : xy[0] * 750 + 160,
                y : xy[1] * 750 + 150
            });
//            console.log(this.nodes[m].x, this.nodes[m].y);
            this.alias[this.nodes[m].name] = m;
        }

//        var previous_group = 0;
//        for (var i = 0; i < this.nodes.length; i++) {
//
//            var d = this.nodes[i].group == previous_group ? 0.1 : 3.0;
//            previous_group = this.nodes[i].group;
//            var segLength = d / (this.nodes.length - 1);
//            var xy = g.index2coord(segLength * i, 5);
//            _.extend(this.nodes[i], {
//                x : xy[0] * 750 + 160,
//                y : xy[1] * 750 + 100
//            });
//            this.alias[this.nodes[i].name] = i;
//        }
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