// ***** call from server *****
now.setNodes = function (nodes) { _nodes = nodes;};
now.setEdges = function(edges) { _edges = edges; };
now.setDegree = function(degree) { _degree = degree; };
now.update = function() { init(); animate(); };
now.ready(function() {
    var Widget = function() {
        this.animate = function() { tweenNodes(); };
        this.addEdges = function() { initEdges(); };
    }

    var widget = new Widget();
    var gui = new dat.GUI();
    gui.add(widget, 'animate');
    gui.add(widget, 'addEdges');

    now.start();  // go!
});
// ***** call from server *****

var W, H, canvas, camera, scene, renderer, stats;
var nodes, edges, nodeGeometry, edgeGeometry, nodeMaterial, edgeMaterial;
var object, uniforms, attributes, shaderMaterial, geometry;
var _nodes = [], _edges = [], _degree = 7;
//var colors = [0xF81F37, 0xF8981F, 0xEECF09, 0x8FD952, 0x0D9FD8, 0x8C71D1, 0xF640AE];
var colormap = ['red', 'orange', 'green', 'cyan', 'blue', 'violet'];
var layout = { 7: [0, 1, 6, 4, 5, 3, 7], 8: [0, 1, 6, 4, 2, 3, 7] };
var print = console.log.bind(console);
var cx = 440, cy = 400;

function init() {
    canvas = document.getElementById("canvas");
    W = canvas.clientWidth; H = W * 0.9;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    canvas.appendChild(renderer.domElement);

    var scale = 1.5;
    camera = new THREE.OrthographicCamera(-W/scale, W/scale, H/scale, -H/scale, 1, 1000);
    camera.position.set(cx, cy, 1);
    scene = new THREE.Scene();
    scene.add(camera);

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    canvas.appendChild(stats.domElement);

//    tweenNodes();
//    initShader();
    initNodes();
    initEdges();
//    drawEdges();
}

function initShader() {
    attributes = {
        vertexColor: { type: "c", value: [] }
    };
    uniforms = {
        opacity:   { type: "f", value: 0.01 }
    };
    shaderMaterial = new THREE.ShaderMaterial( {
        attributes:     attributes,
        uniforms:       uniforms,
        vertexShader:   document.getElementById("vs").textContent,
        fragmentShader: document.getElementById("fs").textContent,
        blending: 		THREE.AdditiveBlending,
        transparent:	true
    });
    shaderMaterial.linewidth = 1;
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
        size: 10, map: THREE.ImageUtils.loadTexture("img/particle1.png"),
        sizeAttenuation: false, blending: THREE.NormalBlending, transparent: true,
        vertexColors: THREE.VertexColors
    });
    for (var n = 0; n < _nodes.length; n++) {
        var node = _nodes[n];
        var pos = node.positions[layout[_degree][node.cluster]];
        nodeGeometry.vertices.push(new THREE.Vector3(pos[0]*W, pos[1]*H));
        nodeColors[n] = new THREE.Color(colormap[node.label % colormap.length]);
    }
    nodeGeometry.colors = nodeColors;
    nodes = new THREE.ParticleSystem(nodeGeometry, nodeMaterial);
    scene.add(nodes);
}

function drawEdges() {
    var edgeLength = _edges.length;
    edgeGeometry = new THREE.BufferGeometry();
    edgeGeometry.attributes = {  // index: i;  position: xyz * 2 vertices;  color: rgb * 2 vertices;
        position:   { itemSize: 3, array: new Float32Array(edgeLength*3*2), numItems: edgeLength*3*2 },
        color:      { itemSize: 3, array: new Float32Array(edgeLength*3*2), numItems: edgeLength*3*2 }
    };

    var positions = edgeGeometry.attributes.position.array;
    var colors = edgeGeometry.attributes.color.array;

    for (var e = 0; e < edgeLength; e++) {
        var source = _nodes[_edges[e].source];
        var target = _nodes[_edges[e].target];
        var sourcePos = source.positions[layout[_degree][source.cluster]];
        var targetPos = target.positions[layout[_degree][target.cluster]];
        var sourceColor = new THREE.Color(colormap[source.label % colormap.length]);
        var targetColor = new THREE.Color(colormap[target.label % colormap.length]);
        positions[e*6+0] = sourcePos[0]*W;
        positions[e*6+1] = sourcePos[1]*H;
        positions[e*6+2] = 0;
        positions[e*6+3] = targetPos[0]*W;
        positions[e*6+4] = targetPos[1]*H;
        positions[e*6+5] = 0;
        colors[e*6+0] = sourceColor.r;
        colors[e*6+1] = sourceColor.g;
        colors[e*6+2] = sourceColor.b;
        colors[e*6+3] = targetColor.r;
        colors[e*6+4] = targetColor.g;
        colors[e*6+5] = targetColor.b;
    }

    edgeMaterial = new THREE.LineBasicMaterial({
        transparent: false, blending: THREE.NoBlending, vertexColors: THREE.VertexColors
    });

    edges = new THREE.Line(edgeGeometry, edgeMaterial, THREE.LinePieces);
    scene.add(edges);
}

function initEdges() {
    var edgeColors = [];

    edgeGeometry = new THREE.Geometry();
    edgeMaterial = new THREE.LineBasicMaterial({
        transparent: false, blending: THREE.NoBlending, vertexColors: THREE.VertexColors
    });

    for (var i = 0; i < _edges.length; i++) {
        var src = _nodes[_edges[i].source];
        var tgt = _nodes[_edges[i].target];
        var posSrc = src.positions[layout[_degree][src.cluster]];
        var posTgt = tgt.positions[layout[_degree][tgt.cluster]];
        edgeGeometry.vertices.push(new THREE.Vector3(posSrc[0]*W, posSrc[1]*H));
        edgeGeometry.vertices.push(new THREE.Vector3(posTgt[0]*W, posTgt[1]*H));
        edgeColors.push(new THREE.Color(colormap[src.label % colormap.length]));
        edgeColors.push(new THREE.Color(colormap[tgt.label % colormap.length]));
    }
    edgeGeometry.colors = edgeColors;
    edges = new THREE.Line(edgeGeometry, edgeMaterial, THREE.LinePieces);
    scene.add(edges);
}

function animate() {
//    nodes.geometry.verticesNeedUpdate = true;
//    TWEEN.update();
    requestAnimationFrame(animate);
    render();
    stats.update();
}

function render() {
    renderer.render(scene, camera);
}
