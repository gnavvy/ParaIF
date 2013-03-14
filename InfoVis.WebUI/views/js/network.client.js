var _nodes = [];
var _edges = [];
var _auxil = [];

var w = 900, h = 900, r = 5;
var color = d3.scale.category10();
//var scheme0 = d3.interpolateHsl('rgb(255, 64, 64)', 'rgb( 64,255, 64)');
//var scheme1 = d3.interpolateHsl('rgb(255,128,128)', 'rgb(128,255,128)');
//var color = d3.scale.linear().domain([-0.5, 0.5]).range([0, 100]);

var force = d3.layout.force()
    .gravity(0.05)
    .charge(-30)
    .linkDistance(30)
    .size([w, h]);
//    .on("tick", tick);

var viz = d3.select("#viz")
    .attr("width", w)
    .attr("height", h)
    .on("mouseup", mouseup)
    .on("mousemove", mousemove);

var bundle = d3.layout.bundle();
var line = d3.svg.line.radial()
    .interpolate("bundle")
    .tension(.85)
    .radius(function(d) { return d.y; })
    .angle(function(d) { return d.x / 180 * Math.PI; });

// ***** call from server *****
now.setNodes = function (nodes) { _nodes = nodes; };
now.setEdges = function(edges) { _edges = edges; };
now.setAuxil = function(points) { _auxil = points; };
now.log = function(msg) { log(msg); };
// ***** call from server *****

function update() {
    plot();
//    auxil();
}

function auxil() {
    log("auxil start");

    viz.selectAll(".au").data(_auxil)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", r);
//        .style("fill", ""function(d) {
//            return d.group == -1 ? "grey" : color(d.group);
//        })

    force.nodes(_nodes).links(_edges).start();

    viz.selectAll(".link").data(_edges)
        .enter().append("svg:line")
        .attr("class", "link")
        .style("stroke", "lightgrey")
        .style("stroke-width", 1.0);

    viz.selectAll(".node").data(_nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", r)
        .style("fill", function(d) {
            return d.group == -1 ? "grey" : color(d.group);
        })
        .call(force.drag);

    log("auxil done");
}

function plot() {
    force.nodes(_nodes).links(_edges).start();

    viz.selectAll(".link").data(_edges)
        .enter().append("line")
        .attr("x1", function(edge) { return edge.source.x; })
        .attr("y1", function(edge) { return edge.source.y; })
        .attr("x2", function(edge) { return edge.target.x; })
        .attr("y2", function(edge) { return edge.target.y; })
        .attr("class", "link")
        .style("stroke", function(edge) {
            return edge.source.group == -1 ? "gray" : color(edge.source.group);
        })
        .style("stroke-width", 0.05);

//    viz.selectAll(".link").data(bundle(_edges))
//        .enter().append("path")
////        .attr("x1", function(edge) { return edge.source.x; })
////        .attr("y1", function(edge) { return edge.source.y; })
////        .attr("x2", function(edge) { return edge.target.x; })
////        .attr("y2", function(edge) { return edge.target.y; })
//        .attr("class", "link")
//        .attr("d", line)
//        .style("stroke", function(edge) {
//            return edge.source.group == -1 ? "gray" : color(edge.source.group);
//        });
////        .style("stroke-width", 0.05);

//    svg.selectAll(".link")
//        .data(bundle(links))
//        .enter().append("path")
//        .attr("class", "link")
//        .attr("d", line);

    viz.selectAll(".node").data(_nodes)
        .enter().append("circle")
        .attr("cx", function(node) { return node.x; })
        .attr("cy", function(node) { return node.y; })
        .attr("class", "node")
        .attr("r", r)
        .style("fill", function(node) {
            return node.group == -1 ? "gray" : color(node.group);
        })
        .call(force.drag);
}

function tick() {
    viz.selectAll(".link").data(_edges)
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    viz.selectAll(".node").data(_nodes)
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
}

now.ready(function() {
    d3.select('#reset').on('click', function() { now.reset(); });
    d3.select('#plot').on('click', function() { update(); });

    now.start();  // go!
});

function log(msg) {
    d3.select('#log').html(msg);
}

function mousemove() {
    // var x = d3.mouse(this)[0];
    // var y = d3.mouse(this)[1];
    // now.getLabel([x,y]);
    // log(x + "," + y);
}

function mouseup() {
    // if (!viz) return;
    // var x = d3.mouse(this)[0];
    // var y = d3.mouse(this)[1];
    // now.add(x, y, gid);
}