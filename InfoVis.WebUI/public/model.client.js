var data = [];
var mask = [];

var viz = d3.select("#viz")
  .on("mouseup", mouseup)
  .on("mousemove", mousemove);

var color = ["#38A8E8", "#7AB23C", "#E95A00", "#D51E24"];
var gid = 0;

function enter() {
  viz.selectAll("circle").data(data, p("id")).enter() 
    .append("circle")
    .attr("id", p("id"))
    .attr("class", "default")
    .attr("cx", p("x"))
    .attr("cy", p("y"))
    .style("fill", color[gid])
    .style("fill-opacity", 1)
    .transition()
    .attr("r", p("value"));

  // var mm = viz.selectAll("rect").data(mask).enter()
  // mm.append("svg:rect")
  //   .attr("cx", p["x"])
  //   .attr("cy", p["y"])
  //   .attr("x", p["x"]-p("value")/2)
  //   .attr("y", p["y"]-p("value")/2)
  //   .attr("width", 0)
  //   .attr("height", 0)
  //   .style("fill", color[p["group"]]);
  //   .style("fill-opacity", 0.5)
  //   .transition()
  //   .attr("width", p("value"))
  //   .attr("height", p("value"))    
}
 
function exit() {
  viz.selectAll("circle").data(data, p("id")).exit() 
    .attr("class", null)
    .style("stroke-opacity", 0)
    .transition()
    .attr("r", function(d) { return 2.0 * d.value; })
    .style("fill-opacity", 0)
    .each("end", function () { d3.select(this).remove(); });
  
  // var mm = viz.selectAll("rect").data(mask).exit()
  // mm.transition()
  //   .attr("width", function(d) { return 2.0 * d.value; })
  //   .attr("height", function(d) { return 2.0 * d.value; })
  //   .style("fill-opacity", 0)
  //   .each("end", function () { d3.select(this).remove(); });
}
 
function update() {
  enter();

  viz.selectAll("circle").data(data, p("id"))
    .transition().duration(1)
    .attr("r", p("value"))
    .attr("cx", p("x"))
    .attr("cy", p("y"));  

  // var mm = viz.selectAll("rect").data(mask)
  // mm.transition()
  //   .attr("cx", p["x"])
  //   .attr("cy", p["y"])
  //   .attr("x", p["x"]-p("value")/2)
  //   .attr("y", p["y"]-p("value")/2)
  //   .attr("width", p("value"))
  //   .attr("height", p("value"))    

  exit();
}

function updateMask() {
  var g = viz.append("svg:g").data(mask);
  g.append("svg:rect")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("x", -100)
    .attr("y", -100)
    .attr("width", 10)
    .attr("height", 10)
    // .attr("transform", function(d, i) { 
    //   return "scale(" + (1 - d / 25) * 20 + ")"; 
    // })
    .style("fill", d3.scale.category20c());
    // .style("stroke", "rgb(6,120,155)");
  // viz.append("svg:rect").append("svg:g").data(mask)
  // .attr("x", 100)
  // .attr("y", 100)
  // .attr("width", 200)
  // .attr("height", 200);
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
  log(mask);
  update();
}

now.log = function(msg) {
  log(msg);
}
// ***** call from server *****

now.ready(function() {
  d3.select('#reset').on('click', function() { now.reset(); });
  d3.select('#add').on('click', function() { now.add(); });
  // d3.select('#shuffle').on('click', function() { now.shuffle(); });
  // d3.select('#stream').on('click', function() { now.stream(); });
  d3.select('#retrain').on('click', function() { now.retrain(); });
  d3.select('#test').on('click', function() { now.test(); });

  d3.select('#blue').on('click', function() { gid = 0; });
  d3.select('#green').on('click', function() { gid = 1; });
  d3.select('#orange').on('click', function() { gid = 2; });
  d3.select('#red').on('click', function() { gid = 3; });

  d3.select('#debug').on('click', function() { 
    updateMask();
  });

  now.start();  // go!
});

function log(msg) {
  d3.select('#log').html(msg);
}

// utils
function p(propName) { 
  return function(d) { return d[propName]; };
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