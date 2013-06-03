// ***** call from server *****
now.setNodes = function (nodes) { _nodes = nodes;};
now.setEdges = function(edges) { _edges = edges; };
now.setDegree = function(degree) { _degree = degree; };
now.update = function() { init(); animate(); };
now.ready(function() {
    var Widget = function() {
        this.animate = function() { toggleTween = !toggleTween };
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
var _nodes = [], _edges = [], _degree = 7;
var toggleTween = false;
var colormap = ['red', 'orange', 'green', 'cyan', 'blue', 'violet'];
var layout = { 7: [0, 1, 6, 5, 4, 3], 8: [1, 6, 5, 4, 3, 0] };
var print = console.log.bind(console);

function init() {
    canvas = document.getElementById("canvas");
    W = canvas.clientWidth; H = W * 0.9;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    canvas.appendChild(renderer.domElement);

    var scale = 1.5;
    camera = new THREE.OrthographicCamera(-W/scale, W/scale, H/scale, -H/scale, 1, 1000);
    scene = new THREE.Scene();
    scene.add(camera);

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    canvas.appendChild(stats.domElement);

    initNodes();
    initEdges();
    initTween();

    window.addEventListener( 'resize', onWindowResize, false );
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
    nodeGeometry.computeBoundingBox();
    nodes = new THREE.ParticleSystem(nodeGeometry, nodeMaterial);
    scene.add(nodes);

    var center = getGeometryCenter(nodeGeometry.boundingBox);
    camera.position.set(center.x, center.y, center.y);
}

function initEdges() {
    edgeMaterial = new THREE.ShaderMaterial( {
        attributes:     { customColor: { type: "c", value: [] } },
        uniforms:       { opacity:   { type: "f", value: 0.02 } },
        vertexShader:   document.getElementById("vs").textContent,
        fragmentShader: document.getElementById("fs").textContent,
        blending: 		THREE.AdditiveBlending,
        transparent:	true
    });
    edgeMaterial.linewidth = 2;

    var edgeColors = edgeMaterial.attributes.customColor.value;

    edgeGeometry = new THREE.Geometry();
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

function initTween() {
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

function getGeometryCenter(boundary) {
    return new THREE.Vector3(
        0.5 * (boundary.min.x + boundary.max.x),
        0.5 * (boundary.min.y + boundary.max.y),
        0.5 * (boundary.min.z + boundary.max.z));
}

function animate() {
    if (toggleTween) {
        nodes.geometry.verticesNeedUpdate = true;
        TWEEN.update();
    }

    requestAnimationFrame(animate);
    render();
    stats.update();
}

function render() {
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientWidth * 0.9);
}