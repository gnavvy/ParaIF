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

var canvas, camera, scene, renderer, stats;
var nodeGeometry, edgeGeometry, nodeMaterial, edgeMaterial;
var W, H;
var _nodes = [], _edges = [];
var colors = [0xF81F37, 0xF8981F, 0xEECF09, 0x8FD952, 0x0D9FD8, 0x8C71D1, 0xF640AE];
//var colors = ['0xF7D1C5', '0xF7E9C7', '0xF7F2C5', '0xE9F7C7', '0xC5F7EB', '0xC5CEF7', '0xEEC5F7'];

function init() {
    canvas = document.getElementById("canvas");
    W = canvas.clientWidth; H = W * 0.9;

    renderer = new THREE.CanvasRenderer();
//    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize(W, H);

    canvas.appendChild(renderer.domElement);

    camera = new THREE.OrthographicCamera(-W/2, W/2, H/2, -H/2, 1, 1000);
    camera.position.set(W/2, H/2, 1);

    scene = new THREE.Scene();
    scene.add(camera);

    initEdges();
    initNodes();
}

function initNodes() {
    nodeGeometry = new THREE.CircleGeometry(4);
    for (var n = 0; n < _nodes.length; n++) {
        var node = _nodes[n];
        nodeMaterial = new THREE.MeshBasicMaterial({ color: colors[node.group % colors.length] });
        var circle = new THREE.Mesh(nodeGeometry, nodeMaterial);
        circle.position.set(node.x * W, node.y * H, 0);
        scene.add(circle);
    }
}

function initEdges() {
    var edgeColors = [];
    edgeGeometry = new THREE.Geometry();
    edgeMaterial = new THREE.LineBasicMaterial({
        opacity: 0.1, color: 0xffffff, lineWidth: 3,
        vertexColors: THREE.VertexColors
    });
    for (var i = 0; i < _edges.length; i++) {
        var src = _nodes[_edges[i].source];
        var tgt = _nodes[_edges[i].target];
        edgeColors[i] = new THREE.Color(colors[src.group % colors.length]);
        edgeGeometry.vertices.push(new THREE.Vector3(src.x * W, src.y * H));
        edgeGeometry.vertices.push(new THREE.Vector3(tgt.x * W, tgt.y * H));
    }
    edgeGeometry.colors = edgeColors;
    var edges = new THREE.Line(edgeGeometry, edgeMaterial, THREE.LinePieces);
    scene.add(edges);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    renderer.render(scene, camera);
}