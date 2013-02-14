var _nodes = [];
var _edges = [];

var width = 900, height = 500;
var color = d3.scale.category20();
var force = d3.layout.force()
    .charge(-120)
    .linkDistance(30)
    .size([width, height]);

force.on("tick", function() {
  viz.selectAll(".link").data(_edges)
    .attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });

  viz.selectAll(".node").data(_nodes)
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; });
});

var viz = d3.select("#viz")
  .attr("width", width)
  .attr("height", height)
  .on("mouseup", mouseup)
  .on("mousemove", mousemove);

// ***** call from server *****
now.setNodes = function(nodes) { 
  _nodes = nodes; 
}

now.setEdges = function(edges) {
  _edges = edges;
}

now.log = function(msg) { 
  log(msg); 
}
// ***** call from server *****

function enter() {
  log("enter start");
  
  force
    .nodes(_nodes)
    .links(_edges)
    .start();

  viz.selectAll(".link").data(_edges)
    .enter().append("line")
    .attr("class", "link")
    .style("stroke", function(d) { return color(0); })
    .style("stroke-width", function(d) { return d.weight; });

  viz.selectAll(".node").data(_nodes)
    .enter().append("circle")
    .attr("class", "node")
    .attr("r", 5)
    .style("fill", function(d) { return color(1); })
    .call(force.drag); 

  log("enter done");
}
 
function exit() { }
function update() {
  enter();
  exit();
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