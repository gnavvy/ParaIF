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

var camera, scene, renderer, projector;
var geometry, material, mesh;
var W = window.innerWidth * 0.9, H = W;
var coef = 5;
var w = W / coef, h = H / coef;
var _nodes = [], _edges = [];

//function update() {
//    init();
//    animate();
//}

function init() {
    renderer = new THREE.CanvasRenderer();
    renderer.setSize(W, H);
    document.getElementById("canvas").appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(45, W / H, 1, 1000);
    camera.position.z = 500;

    scene = new THREE.Scene();
    scene.add(camera);

    material = new THREE.LineBasicMaterial({
        color: 'blue', opacity: 0.05, linewidth: 0.5
    });

    var vi, vj, line;
    for (var i = 0; i < _nodes.length; i++) {
        vi = new THREE.Vertex(new THREE.Vector3(_nodes[i].x * w, _nodes[i].y * h, 0));
        for (var j = i + 1; j < _nodes.length; j++) {
            vj = new THREE.Vertex(new THREE.Vector3(_nodes[j].x * w, _nodes[j].y * h, 0));
            line = create_line(vi, vj);
            scene.add(line);
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
//    mesh.rotation.x += 0.01;
//    mesh.rotation.y += 0.02;
    renderer.render(scene, camera);
}

function create_line(v0, v1) {
    geometry = new THREE.Geometry(); {
        geometry.vertices.push(v0);
        geometry.vertices.push(v1);
    }
    return new THREE.Line(geometry, material);
}