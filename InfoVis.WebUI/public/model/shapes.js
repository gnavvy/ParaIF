// an array of circle objects
var data = [];
 
function enter() {
  var circles = d3.select('#viz').selectAll("circle").data(data, use("id"));

  circles.enter() // the enter set, a set of new data entries without DOM equivalent
    .append("circle")
    .attr("id", use("id"))
    .attr("class", "default")
    .attr("r", 0)
    .attr("cx", use("x"))
    .attr("cy", use("y"))
    .style("fill", use("color"))
    .style("fill-opacity", use("opacity"))
    .transition()
    .attr("r", use("r"));
}
 
function exit() {
  var circles = d3.select('#viz').selectAll("circle").data(data, use("id"));
  circles.exit() // the exit set, a set of superfluous DOM nodes without data equivalent
    .attr("class", null)
    .style("stroke-opacity", 0)
    .transition()
    .attr("r", function(d) { return 1.8*d.r; })
    .style("fill-opacity", 0)
    .each("end", function () { d3.select(this).remove(); });
}
 
function update() {
  enter();
  var circles = d3.select('#viz').selectAll("circle").data(data, use("id"));
  circles // the update set, all DOM nodes with a data binding
    .transition().duration(1)
    .attr("r", use("r"))
    .attr("cx", use("x"))
    .attr("cy", use("y"));
  exit();
}
 
function translate() {
  var circles = d3.select('#viz').selectAll("circle").data(data, use("id"));
  circles // the update set, all DOM nodes with a data binding
  .transition().duration(10)
  .attr("r", use("r"))
  .attr("cx", use("x"))
  .attr("cy", use("y"));
}

// ***** called from server
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

now.translate = function(ts, entry) {
  data.length = 0;
  data.push(entry);
  update();
}
// *****

now.ready(function() {
  now.start();
  d3.select('#reset').on('click', function() { now.reset(); });
});

function log(ts, msg) {
  var format = d3.time.format("%X");
  d3.select('#log').html('[' + format(new Date(ts)) + "." + ts%1000 + '] ' + msg);
}
 
function use(propName) { 
  return function(d) { return d[propName]; };
}