// an array of objects
var data = [];

var viz = d3.select("#viz")
  .on("mouseup", mouseup)
  .on("mousemove", mousemove);

var color = ["#38A8E8", "#7AB23C", "#E95A00", "#D51E24"];
var gid = 0;

function enter() {
  var data_points = viz.selectAll("circle").data(data, p("id"));

  data_points.enter() 
    .append("circle")
    .attr("id", p("id"))
    .attr("class", "default")
    .attr("cx", p("x"))
    .attr("cy", p("y"))
    .style("fill", color[gid])
    .style("fill-opacity", 1)
    .transition()
    .attr("r", p("value"));
}
 
function exit() {
  var data_points = viz.selectAll("circle").data(data, p("id"));

  data_points.exit() 
    .attr("class", null)
    .style("stroke-opacity", 0)
    .transition()
    .attr("r", function(d) { return 2.0 * d.value; })
    .style("fill-opacity", 0)
    .each("end", function () { d3.select(this).remove(); });
}
 
function update() {
  enter();

  var data_points = viz.selectAll("circle").data(data, p("id"));

  data_points
    .transition().duration(1)
    .attr("r", p("value"))
    .attr("cx", p("x"))
    .attr("cy", p("y"));

  exit();
}

// ***** call from server *****
now.setData = function(data_points) {
  data = data_points;
  update();
  log(data.length + " data points updated");
};

now.addData = function(entry) {
  data.push(entry);
  update();
  log("circle added, id=" + entry.id);
};

now.removeData = function(id) {
  for (var i=0; i<data.length; i++) {
    if (data[i].id == id) {
      data.splice(i, 1);
      break;
    }
  }
  exit();
  log("circle removed, id=" + id);
};

now.log = function(msg) {
  log(msg);
}
// ***** call from server *****

now.ready(function() {
  d3.select('#reset').on('click', function() { now.reset(); });
  d3.select('#add').on('click', function() { now.add(); });
  d3.select('#shuffle').on('click', function() { now.shuffle(); });
  d3.select('#stream').on('click', function() { now.stream(); });
  d3.select('#retrain').on('click', function() { now.retrain(); });

  d3.select('#blue').on('click', function() { gid = 0; });
  d3.select('#green').on('click', function() { gid = 1; });
  d3.select('#orange').on('click', function() { gid = 2; });
  d3.select('#red').on('click', function() { gid = 3; });

  d3.select('#debug').on('click', function() { 
    // var label = now.getLabel([100,100]);
    // log("100,100: " + label);
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
  var x = d3.mouse(this)[0];
  var y = d3.mouse(this)[1];
  // now.getLabel([x,y]);
  // log(x + "," + y);
};

function mouseup() {
  if (!viz) return;
  var x = d3.mouse(this)[0];
  var y = d3.mouse(this)[1];
  now.add(x, y, gid);
}