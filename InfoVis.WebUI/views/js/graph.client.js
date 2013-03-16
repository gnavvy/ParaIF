// ***** call from server *****
now.setNodes = function (nodes) { _nodes = nodes;};
now.setEdges = function(edges) { _edges = edges; };
now.update = function() { init(); animate(); };
now.ready(function() {
//    alert('ready to start');
//    d3.select('#deg7').on('click', function() { _d = 7; now.reset(_d, _o); });
    now.start();  // go!
});
// ***** call from server *****

var canvas, camera, scene, renderer, projector;
var geometry, materials, mesh;
var W, H;
var _nodes = [], _edges = [];
var colors = [0xF81F37, 0xF8981F, 0xEECF09, 0x8FD952, 0x0D9FD8, 0x8C71D1, 0xF640AE];
//var colors = ['0xF7D1C5', '0xF7E9C7', '0xF7F2C5', '0xE9F7C7', '0xC5F7EB', '0xC5CEF7', '0xEEC5F7'];

function init() {
    canvas = document.getElementById("canvas");
    W = canvas.clientWidth;
    H = W * 0.9;

    renderer = new THREE.CanvasRenderer();
    renderer.setSize(W, H);

    canvas.appendChild(renderer.domElement);

    camera = new THREE.OrthographicCamera(-W/2, W/2, H/2, -H/2, 1, 1000);
    camera.position.set(W/2, H/2, 1);

    scene = new THREE.Scene();
    scene.add(camera);

    var src, tgt, vi, vj, line;
    for (var k = 0; k < _edges.length; k++) {
        src = _nodes[_edges[k].source];
        tgt = _nodes[_edges[k].target];
        vi = new THREE.Vector3(src.x * W, src.y * H, 0);
        vj = new THREE.Vector3(tgt.x * W, tgt.y * H, 0);
        line = create_line(vi, vj, colors[src.group % colors.length]);
        scene.add(line);
    }

    var cg = new THREE.CircleGeometry(4);
    var node, c, circle;
    for (var n = 0; n < _nodes.length; n++) {
        node = _nodes[n];
        c = colors[node.group % colors.length];
        circle = new THREE.Mesh(cg, new THREE.MeshBasicMaterial({color: c}));
        circle.position.set(node.x * W, node.y * H, 0);
        scene.add(circle);
    }
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    renderer.render(scene, camera);
}

function create_line(v0, v1, color) {
    var geometry = new THREE.Geometry(); {
        geometry.vertices.push(v0);
        geometry.vertices.push(v1);
    }
    var lineMat = new THREE.LineBasicMaterial({
        opacity: 0.1, linewidth: 1, color: color
    });
    return new THREE.Line(geometry, lineMat);
}