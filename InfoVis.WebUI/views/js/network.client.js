var _nodes = [];
var _edges = [];
var _paths = "";
var _d = 19, _o = 4;

var w = 900, h = 900;
var color = d3.scale.category10();

//var force = d3.layout.force().size([w, h]);
//    .gravity(0.05)
//    .charge(-30)
//    .linkDistance(30)
//    .on("tick", tick);

var viz = d3.select("#viz").attr("width", w).attr("height", h);
//    .on("mouseup", mouseup)
//    .on("mousemove", mousemove);

//var bundle = d3.layout.bundle();
//var line = d3.svg.line.radial()
//    .interpolate("bundle")
//    .tension(.85)
//    .radius(function(d) { return d.y; })
//    .angle(function(d) { return d.x / 180 * Math.PI; });
//var line = d3.svg.line()
//    .x1(function(d) { return d.source.x})
//    .y1(function(d) { return d.source.y})
//    .x2(function(d) { return d.target.x})
//    .y2(function(d) { return d.target.y});

// ***** call from server *****
now.setNodes = function (nodes) { _nodes = nodes; };
now.setEdges = function(edges) { _edges = edges; };
now.setPaths = function(paths) { _paths = paths; };
now.update = function() { update(); };
now.log = function(msg) { log(msg); };
// ***** call from server *****

function update() {
//    force.nodes(_nodes).links(_edges).start();

    viz.append("svg:path")
        .attr("d", _paths)
        .style("stroke-width", 0.05)
        .style("stroke", "grey")
        .style("fill", "none");

//    viz.selectAll(".link").data(_edges)
//        .enter().append("line")
//        .attr("x1", function(edge) { return edge.source.x; })
//        .attr("y1", function(edge) { return edge.source.y; })
//        .attr("x2", function(edge) { return edge.target.x; })
//        .attr("y2", function(edge) { return edge.target.y; })
//        .attr("class", "link")
//        .style("stroke", function(edge) {
//            return edge.source.group == -1 ? "gray" : color(edge.source.group);
//        })
//        .style("stroke-width", 0.05);

    viz.selectAll(".node").data(_nodes)
        .enter().append("circle")
        .attr("cx", function(node) { return node.x; })
        .attr("cy", function(node) { return node.y; })
        .attr("class", "node")
        .attr("r", 2.0)
        .style("fill", function(node) {
            return node.group == -1 ? "gray" : color(node.group);
        });
}

//function tick() {
//    viz.selectAll(".link").data(_edges)
//        .attr("x1", function(d) { return d.source.x; })
//        .attr("y1", function(d) { return d.source.y; })
//        .attr("x2", function(d) { return d.target.x; })
//        .attr("y2", function(d) { return d.target.y; });
//
//    viz.selectAll(".node").data(_nodes)
//        .attr("cx", function(d) { return d.x; })
//        .attr("cy", function(d) { return d.y; });
//}

now.ready(function() {
    log('ready to start');
    d3.select('#deg7').on('click', function() { _d = 7; now.reset(_d, _o); });
    d3.select('#deg19').on('click', function() { _d = 19; now.reset(_d, _o); });
    d3.select('#order1').on('click', function() { _o = 1; now.reset(_d, _o); });
    d3.select('#order2').on('click', function() { _o = 2; now.reset(_d, _o); });
    d3.select('#order3').on('click', function() { _o = 3; now.reset(_d, _o); });
    d3.select('#order4').on('click', function() { _o = 4; now.reset(_d, _o); });
    d3.select('#order5').on('click', function() { _o = 5; now.reset(_d, _o); });
    d3.select('#order6').on('click', function() { _o = 6; now.reset(_d, _o); });
    d3.select('#plot').on('click', function() { update(); });
    now.start();  // go!
});

function log(msg) {
    d3.select('#log').html(msg);
}

//function mousemove() {
    // var x = d3.mouse(this)[0];
    // var y = d3.mouse(this)[1];
    // now.getLabel([x,y]);
    // log(x + "," + y);
//}

//function mouseup() {
    // if (!viz) return;
    // var x = d3.mouse(this)[0];
    // var y = d3.mouse(this)[1];
    // now.add(x, y, gid);
//}