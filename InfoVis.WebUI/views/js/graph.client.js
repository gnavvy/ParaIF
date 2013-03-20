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
var nodes, edges;
var object, uniforms, attributes;
var nodeGeometry, edgeGeometry, nodeMaterial, edgeMaterial;
var print = console.log.bind(console);
var W, H;
var _nodes = [], _edges = [];
//var colors = [0xF81F37, 0xF8981F, 0xEECF09, 0x8FD952, 0x0D9FD8, 0x8C71D1, 0xF640AE];
var colors = ['red', 'orange', 'green', 'cyan', 'blue', 'violet'];

function init() {
    canvas = document.getElementById("canvas");
    W = canvas.clientWidth; H = W * 0.9;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    canvas.appendChild(renderer.domElement);

    camera = new THREE.OrthographicCamera(-W/2, W/2, H/2, -H/2, 1, 1000);
    camera.position.set(W/2, H/2, 1);

    scene = new THREE.Scene();
    scene.add(camera);

//    initEdges();
    initNodes();
    tweenNodes();
}

function tweenNodes() {
    for (var i = 0; i < nodeGeometry.vertices.length; i++) {
        var target = {x: W/2, y: H/2};
        var tween = new TWEEN.Tween(nodeGeometry.vertices[i]).to(target, 2000);
        tween.easing(TWEEN.Easing.Quadratic.InOut);
        tween.start();
    }
}

function initNodes() {
    var nodeColors = [];
    nodeGeometry = new THREE.Geometry();
    nodeMaterial = new THREE.ParticleBasicMaterial({
        size: 10,
        map: THREE.ImageUtils.loadTexture("img/particle1.png"),
        sizeAttenuation: false, blending: THREE.NormalBlending, transparent: true,
        vertexColors: THREE.VertexColors
    });
    for (var n = 0; n < _nodes.length; n++) {
        var node = _nodes[n];
        nodeColors[n] = new THREE.Color(colors[node.label % colors.length]);
        nodeGeometry.vertices.push(new THREE.Vector3(node.x * W, node.y * H));
    }
    nodeGeometry.colors = nodeColors;
    nodes = new THREE.ParticleSystem(nodeGeometry, nodeMaterial);
    scene.add(nodes);
}

function initEdges() {
    var edgeColors = [];

//    var lineBasicMaterial = new THREE.LineBasicMaterial( { color: 0xaaff0f, opacity:1, linewidth:5 } ) // a
//    var meshBasicMaterial = new THREE.MeshBasicMaterial({wireframe: true, wireframeLinewidth : 5}) // b
//    var shader_material = new THREE.ShaderMaterial({wireframe: true, wireframeLinewidth : 5}) // c

    edgeGeometry = new THREE.Geometry();
    edgeMaterial = new THREE.LineBasicMaterial({
        lineWidth: 1, opacity: 1, transparent: false,
        blending: THREE.NoBlending,
        vertexColors: THREE.VertexColors
    });

    for (var i = 0; i < _edges.length; i++) {
        var src = _nodes[_edges[i].source];
        var tgt = _nodes[_edges[i].target];
        edgeColors.push(new THREE.Color(colors[src.label % colors.length]));
        edgeColors.push(new THREE.Color(colors[tgt.label % colors.length]));
        edgeGeometry.vertices.push(new THREE.Vector3(src.x * W, src.y * H));
        edgeGeometry.vertices.push(new THREE.Vector3(tgt.x * W, tgt.y * H));
    }
    edgeGeometry.colors = edgeColors;
    edgeGeometry.dynamic = true;
    edges = new THREE.Line(edgeGeometry, edgeMaterial, THREE.LinePieces);
    scene.add(edges);
}

function animate() {
    nodes.geometry.verticesNeedUpdate = true;
    TWEEN.update();
    requestAnimationFrame(animate);
    render();
}

function render() {
    renderer.render(scene, camera);
}
