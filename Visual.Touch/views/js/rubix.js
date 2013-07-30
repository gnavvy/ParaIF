// ***** call from server *****
now.setData = function(data) { _data = data; print(_data); };
now.ready(function() { now.start(); });
now.update = function() { init(); animate(); };
// ***** call from server *****

var W, H, w, h;
var canvas, camera, scene, renderer, projector, trackball, stats;  // basic
var screen, floor;
var raycaster;
var _data;
var rubix_count = 8;
var rubix_color = [0x666666, 0x1D8C00, 0x4575D4, 0xE5FB00, 0xDDDDDD, 0xEC0033, 0xFF6501];
var rubix_faces =  [[1, 0, 3, 0, 5, 0], [0, 2, 3, 0, 5, 0],
                    [1, 0, 0, 4, 5, 0], [0, 2, 0, 4, 5, 0],
                    [1, 0, 3, 0, 0, 6], [0, 2, 3, 0, 0, 6],
                    [1, 0, 0, 4, 0, 6], [0, 2, 0, 4, 0, 6]];
var rubix_cubes = [];
var print = console.log.bind(console);

function init() {
    initCanvas();
    initScene();
    initRubix();
}

function initCanvas() {
    window.addEventListener('resize', onWindowResize, false);
    W = window.innerWidth;  H = window.innerHeight;
    w = 160; h = 90;

    // Canvas - full browser screen mode
    canvas = document.createElement("div");
    document.body.appendChild(canvas);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H, undefined);
    renderer.setFaceCulling(THREE.CullFaceNone, undefined);
    canvas.appendChild(renderer.domElement);

    // Stats
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    canvas.appendChild(stats.domElement);

    // Projector
    projector = new THREE.Projector();

    // Mouse Event
    document.addEventListener('mousedown', onDocumentMouseDown, false);
}

function initScene() {
    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(45, W/H, 1, 10000);
    camera.position.set(-w*15, h*15, w*15);
    camera.lookAt(scene.position);
    scene.add(camera);

    // add subtle blue ambient lighting
    var ambientLight = new THREE.AmbientLight(0x000044);
    scene.add(ambientLight);

    // directional lighting
    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    // Trackball
    trackball = new THREE.TrackballControls(camera);
    trackball.staticMoving = true;
    trackball.addEventListener('change', render);

    // Axis
    var axis = new THREE.AxisHelper(100);
    axis.position.set(0, 0, 0);
    scene.add(axis);

    // Ray
    raycaster = new THREE.Raycaster();

    // Floor
    floor = new THREE.Mesh(
        new THREE.PlaneGeometry(w*20, w*20, w/5, w/5),
        new THREE.MeshBasicMaterial({ color: 0xcccccc, wireframe: true })
    );
    floor.rotation.x = -Math.PI/2;
    scene.add(floor);
}

function initRubix() {
    for (var n = 0; n < rubix_count; n++) {
        var geometry = new THREE.CubeGeometry(200, 200, 200);
        for (var i = 0; i < geometry.faces.length; i++) {
            var face_color_id = rubix_faces[n][i];
            geometry.faces[i].color.setHex(rubix_color[face_color_id]);
        }
        var material = new THREE.MeshBasicMaterial({
            vertexColors: THREE.FaceColors, transparent: true, blending: THREE.NormalBlending, opacity: 0.9
        });

        var cube = new THREE.Mesh(geometry, material);
        cube.position.x = Math.random() * W * 2 - W;
        cube.position.y = Math.random() * W;
        cube.position.z = Math.random() * W * 2 - W;
        cube.rotation.x = Math.random() * Math.PI;
        cube.rotation.y = Math.random() * Math.PI;
        cube.rotation.z = Math.random() * Math.PI;

        scene.add(cube);
        rubix_cubes.push(cube);
    }
}

function animate() {
    requestAnimationFrame(animate);
    render();
    stats.update();

    if (trackball.enabled) {
        trackball.update();
    }
}

function render() {
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.updateProjectionMatrix();
    W = window.innerWidth;  H = window.innerHeight;
    renderer.setSize(W, H);
}

function onDocumentMouseDown(event) {
    event.preventDefault();

    var vector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1,
                                    -(event.clientY / window.innerHeight) * 2 + 1, 0.5 );

    projector.unprojectVector(vector, camera);
    var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
    var intersects = raycaster.intersectObjects(rubix_cubes);

    if (intersects.length > 0) {
        intersects[0].object.material.color.setHex(Math.random() * 0xffffff);
    }

//    // Parse all the faces
//    for ( var i in intersects ) {
//        intersects[ i ].face.material[ 0 ].color.setHex( Math.random() * 0xffffff | 0x80000000 );
//    }
}