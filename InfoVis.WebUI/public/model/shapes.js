// an array of objects
var data = [];

var viz = d3.select("#viz")
  .on("mousedown mousemove", mousedownmove)
  .on("mouseup", mouseup);

var color = ["#38A8E8", "#7AB23C", "#E95A00", "#D51E24"];
var gid = 0;

function enter() {
  var circles = viz.selectAll("circle").data(data, use("id"));

  circles.enter() 
    .append("circle")
    .attr("id", use("id"))
    .attr("class", "default")
    .attr("r", 0)
    .attr("cx", use("x"))
    .attr("cy", use("y"))
    .style("fill", color[gid])
    .style("fill-opacity", 1)
    .transition()
    .attr("r", use("value"));
}
 
function exit() {
  var circles = viz.selectAll("circle").data(data, use("id"));

  circles.exit() 
    .attr("class", null)
    .style("stroke-opacity", 0)
    .transition()
    .attr("r", function(d) { return 2.0 * d.value; })
    .style("fill-opacity", 0)
    .each("end", function () { d3.select(this).remove(); });
}
 
function update() {
  enter();

  var circles = viz.selectAll("circle").data(data, use("id"));

  circles
    .transition().duration(1)
    .attr("r", use("value"))
    .attr("cx", use("x"))
    .attr("cy", use("y"));

  exit();
}

// ***** call from server *****
now.setData = function(ts, circles) {
  data = circles;
  update();
  log(ts, data.length + " circles updated");
};

now.addData = function(ts, entry) {
  data.push(entry);
  update();
  log(ts, "circle added, id=" + entry.id);
};

now.removeData = function (ts, id) {
  for (var i=0; i<data.length; i++) {
    if (data[i].id == id) {
      data.splice(i, 1);
      break;
    }
  }
  exit();
  log(ts, "circle removed, id=" + id);
};
// ***** call from server *****

now.ready(function() {
  now.start();
  d3.select('#reset').on('click', function() { now.reset(); });
  d3.select('#add').on('click', function() { now.add(); });
  d3.select('#shuffle').on('click', function() { now.shuffle(); });
  d3.select('#stream').on('click', function() { now.stream(); });

  d3.select('#blue').on('click', function() { gid = 0; });
  d3.select('#green').on('click', function() { gid = 1; });
  d3.select('#orange').on('click', function() { gid = 2; });
  d3.select('#red').on('click', function() { gid = 3; });

  d3.select('#debug').on('click', function() { 
    log(new Date().getTime(), gid);
  });

});

function log(ts, msg) {
  var format = d3.time.format("%X");
  d3.select('#log').html('['+format(new Date(ts))+"."+ts%1000+'] '+msg);
}

// utils
function use(propName) { 
  return function(d) { return d[propName]; };
}

function mousedownmove() {
  if (!viz) return;
  var x = d3.mouse(this)[0];
  var y = d3.mouse(this)[1];
  now.add(x, y);
}

function mouseup() {
  if (!viz) return;
  var x = d3.mouse(this)[0];
  var y = d3.mouse(this)[1];
  now.add(x, y);
}