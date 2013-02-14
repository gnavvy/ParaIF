var data = [];
var mask = [];

var viz = d3.select("#viz")
  .on("mouseup", mouseup)
  .on("mousemove", mousemove);

var color = ["#38A8E8", "#7AB23C", "#FFD700", "#D51E24"];
var gid = 0;

var circles = [];
var rectans = [];

function enter() {
  circles = viz.selectAll("circle").data(data, p("id"));
  rectans = viz.selectAll("rect").data(mask, p("id"));

  circles.enter() 
    .append("circle")
    .attr("id", p("id"))
    .attr("class", "default")
    .attr("cx", p("x"))
    .attr("cy", p("y"))
    .style("fill", function(d) { return color[d.group]; })
    .style("fill-opacity", 1)
    .transition()
    .attr("r", p("value"));

  rectans.enter()
    .append("rect")
    .attr("id", p("id"))
    .attr("class", "default")
    .attr("x", function(d) { return d.x; })
    .attr("y", function(d) { return d.y; })
    .attr("width", function(d) { return d.value; })
    .attr("height", function(d) { return d.value; })
    .style("fill", function(d) { return color[d.group]; })
    .style("fill-opacity", 0.4);
}
 
function exit() {
  circles.exit()
    .attr("class", null)
    .style("stroke-opacity", 0)
    .transition()
    .attr("r", function(d) { return 2.0 * d.value; })
    .style("fill-opacity", 0)
    .each("end", function () { d3.select(this).remove(); });

  rectans.exit()
    .attr("class", null)
    .style("stroke-opacity", 0)
    .style("fill-opacity", 0)
    .each("end", function () { d3.select(this).remove(); });
}
 
function update() {
  enter();

  circles.transition().duration(1)
    .attr("r", p("value"))
    .attr("cx", p("x"))
    .attr("cy", p("y"));

  rectans.transition().duration(1)
    .attr("width", function(d) { return d.value; })
    .attr("height", function(d) { return d.value; })
    .attr("x", function(d) { return d.x; })
    .attr("y", function(d) { return d.y; })

  exit();
}

// ***** call from server *****
now.setData = function(data_points) {
  data = data_points;
  update();
};

now.addData = function(entry) {
  data.push(entry);
  update();
};

now.setMask = function(mask_points) {
  mask = mask_points;
  update();
}

now.log = function(msg) {
  log(msg);
}
// ***** call from server *****

now.ready(function() {
  d3.select('#reset').on('click', function() { now.reset(); });
  d3.select('#add').on('click', function() { now.add(); });
  d3.select('#retrain').on('click', function() { now.retrain(); });
  d3.select('#plot').on('click', function() { now.test(); });

  d3.select('#blue').on('click', function() { gid = 0; });
  d3.select('#green').on('click', function() { gid = 1; });
  d3.select('#orange').on('click', function() { gid = 2; });
  d3.select('#red').on('click', function() { gid = 3; });

  now.start();  // go!
});

function log(msg) {
  d3.select('#log').html(msg);
}

// utils
function p(propName) { 
  return function(d) { 
    return d[propName]; 
  };
}

function mousemove() {
  // var x = d3.mouse(this)[0];
  // var y = d3.mouse(this)[1];
  // now.getLabel([x,y]);
  // log(x + "," + y);
};

function mouseup() {
  if (!viz) return;
  var x = d3.mouse(this)[0];
  var y = d3.mouse(this)[1];
  now.add(x, y, gid);
}