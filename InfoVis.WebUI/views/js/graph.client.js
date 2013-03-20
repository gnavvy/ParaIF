// ***** call from server *****
now.setNodes = function (nodes) { _nodes = nodes;};
now.setEdges = function(edges) { _edges = edges; };
now.setDegree = function(degree) { _degree = degree; };
now.update = function() { init(); animate(); };
now.ready(function() {
    var Widget = function() {
        this.animate = function() {
            tweenNodes();
        };
        this.addEdges = function() {
            initEdges();
        };
    }

    var widget = new Widget();
    var gui = new dat.GUI();
    gui.add(widget, 'animate');
    gui.add(widget, 'addEdges');

//    alert('ready to start');
//    d3.select('#deg7').on('click', function() { _d = 7; now.reset(_d, _o); });
    now.start();  // go!
});
// ***** call from server *****
var W, H, canvas, camera, scene, renderer, stats;
var nodes, edges, nodeGeometry, edgeGeometry, nodeMaterial, edgeMaterial;
//var object, uniforms, attributes;
var _nodes = [], _edges = [], _degree = 7;
//var colors = [0xF81F37, 0xF8981F, 0xEECF09, 0x8FD952, 0x0D9FD8, 0x8C71D1, 0xF640AE];
var colors = ['red', 'orange', 'green', 'cyan', 'blue', 'violet'];
var layout = { 7: [0, 1, 6, 4, 5, 3], 8: [0, 1, 6, 4, 2, 3] };
var print = console.log.bind(console);

var Widget = function() {
    this.animate = function() {
        tweenNodes();
    };
    this.addEdges = function() {
        initEdges();
    };
}

function init() {
    canvas = document.getElementById("canvas");
    W = canvas.clientWidth; H = W * 0.9;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    canvas.appendChild(renderer.domElement);
    var scale = 1.5;
    camera = new THREE.OrthographicCamera(-W/scale, W/scale, H/scale, -H/scale, 1, 1000);
//    camera.position.set(W/2, H/2, 1);
//    camera.position.set(425.5, 395.0, 1);
//    camera.position.set(659, 612, 1);
    camera.position.set(434, 320, 1);
    scene = new THREE.Scene();
    scene.add(camera);

//    initEdges();
    initNodes();
//    tweenNodes();
}

function tweenNodes() {
    var ease = TWEEN.Easing.Quadratic.InOut;
    for (var i = 0; i < nodeGeometry.vertices.length; i++) {
        var posSrc = _nodes[i].positions[layout[7][_nodes[i].cluster]];
        var postgt = _nodes[i].positions[layout[8][_nodes[i].cluster]];
        var source = { x: posSrc[0]*W, y: posSrc[1]*H };
        var target = { x: postgt[0]*W, y: postgt[1]*H };
        var tweenForward = new TWEEN.Tween(nodeGeometry.vertices[i]).to(target, 2000).delay(500).easing(ease);
        var tweenBackward = new TWEEN.Tween(nodeGeometry.vertices[i]).to(source, 2000).delay(500).easing(ease);
        tweenForward.chain(tweenBackward);
        tweenBackward.chain(tweenForward);
        tweenForward.start();
    }
}

function initNodes() {
    var nodeColors = [];
    nodeGeometry = new THREE.Geometry();
    nodeMaterial = new THREE.ParticleBasicMaterial({
        size: 12, map: THREE.ImageUtils.loadTexture("img/particle1.png"),
        sizeAttenuation: false, blending: THREE.NormalBlending, transparent: true,
        vertexColors: THREE.VertexColors
    });
    for (var n = 0; n < _nodes.length; n++) {
        var node = _nodes[n];
        var pos = node.positions[layout[_degree][node.cluster]];
        nodeGeometry.vertices.push(new THREE.Vector3(pos[0]*W, pos[1]*H));
        nodeColors[n] = new THREE.Color(colors[node.label % colors.length]);
    }
    nodeGeometry.colors = nodeColors;
//    print(THREE.GeometryUtils.center(nodeGeometry));

//    nodeGeometry.centroid = new THREE.Vector3();
//    nodeGeometry.computeCentroids();
//    print(nodeGeometry.centroid);

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
        var posSrc = src.positions[layout[_degree][src.cluster]];
        var posTgt = tgt.positions[layout[_degree][tgt.cluster]];
        edgeGeometry.vertices.push(new THREE.Vector3(posSrc[0]*W, posSrc[1]*H));
        edgeGeometry.vertices.push(new THREE.Vector3(posTgt[0]*W, posTgt[1]*H));
        edgeColors.push(new THREE.Color(colors[src.label % colors.length]));
        edgeColors.push(new THREE.Color(colors[tgt.label % colors.length]));
    }
    edgeGeometry.colors = edgeColors;
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
