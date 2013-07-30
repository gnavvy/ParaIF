// ***** call from server *****
now.setHands = function(hands) { _hands = hands; print(_hands); };
now.setHead  = function(head)  { _head  = head; };

now.ready(function() { now.start(); });
now.update = function() { init(); animate(); };
//now.update = function() { animate(); };
// ***** call from server *****

var W, H, w, h;
var canvas, camera, scene, renderer, trackball, stats;  // basic
var screen, floor;
var raycaster, intersects;
var _hands, left_hand, right_hand, left_marker, right_marker;
var _head, head, left_line, right_line;
var colormap = ['red', 'orange', 'green', 'cyan', 'blue', 'violet'];
var print = console.log.bind(console);

function init() {
    initCanvas();
    initScene();
    initSkeleton();
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
}

function initScene() {
    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(45, W/H, 1, 10000);
    camera.position.set(-w*10, h*10, w*10);
    camera.lookAt(scene.position);
    scene.add(camera);

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

    // Screen
    screen = new THREE.SceneUtils.createMultiMaterialObject(
        new THREE.PlaneGeometry(w*8, h*8, 4, 4), [
            new THREE.MeshBasicMaterial({ color: 0xaaaaaa, wireframe: true }),  // edge
            new THREE.MeshBasicMaterial({ color: 0xeeeeee })                    // body
        ]
    );
    screen.position.set(0, h*4 + 10, 0);
    scene.add(screen);

    // Floor
    floor = new THREE.Mesh(
        new THREE.PlaneGeometry(w*12, h*10, w/5, h/5),
        new THREE.MeshBasicMaterial({ color: 0xcccccc, wireframe: true })
    );
    floor.rotation.x = -Math.PI/2;
    floor.position.set(0, 0, h*5);
    scene.add(floor);
}

function initSkeleton() {
    // Head - fixed for now
    head = new THREE.Mesh(
        new THREE.SphereGeometry(25, 25, 12),
        new THREE.MeshBasicMaterial({ color: 0x0000ff, opacity: 0.5, transparent: true })
    );
    head.position.x = 0;
    head.position.y = h*2;
    head.position.z = h*8;
    scene.add(head);

    // Hands
    left_hand = new THREE.Mesh(
        new THREE.CubeGeometry(25, 25, 25),
        new THREE.MeshBasicMaterial({ color: 0xff0000, opacity: 0.5, transparent: true })
    );
    scene.add(left_hand);

    right_hand = new THREE.Mesh(
        new THREE.CubeGeometry(25, 25, 25),
        new THREE.MeshBasicMaterial({ color: 0x00ff00, opacity: 0.5, transparent: true })
    );
    scene.add(right_hand);

    // projected positions on screen
    left_marker = new THREE.Mesh(
        new THREE.CubeGeometry(50, 50, 2),
        new THREE.MeshBasicMaterial({ color: 0xff0000, opacity: 0.5, transparent: true })
    );
    scene.add(left_marker);

    right_marker = new THREE.Mesh(
        new THREE.CubeGeometry(50, 50, 2),
        new THREE.MeshBasicMaterial({ color: 0x00ff00, opacity: 0.5, transparent: true })
    );
    scene.add(right_marker);
}

function animate() {
    requestAnimationFrame(animate);
    render();
    stats.update();

    if (_hands) {
        print(_hands);
        left_hand.position.x = _hands.leftHandX * w * 6 / 0.6;
        left_hand.position.y = _hands.leftHandY * h * 5 / 0.4;
        left_hand.position.z = _hands.leftHandZ * h * 5;
        right_hand.position.x = _hands.rightHandX * w * 6 / 0.6;
        right_hand.position.y = _hands.rightHandY * h * 5 / 0.4;
        right_hand.position.z = _hands.rightHandZ * h * 5;
//        left_hand.position.x = _hands[0].x * w * 6 / 0.6;
//        left_hand.position.y = _hands[0].y * h * 5 / 0.4;
//        left_hand.position.z = _hands[0].z * h * 5;
//        right_hand.position.x = _hands[1].x * w * 6 / 0.6;
//        right_hand.position.y = _hands[1].y * h * 5 / 0.4;
//        right_hand.position.z = _hands[1].z * h * 5;
    }

    if (raycaster) {
        var src = new THREE.Vector3(head.position.x, head.position.y, head.position.z);
        var left = new THREE.Vector3(left_hand.position.x, left_hand.position.y, left_hand.position.z);
        var right = new THREE.Vector3(right_hand.position.x, right_hand.position.y, right_hand.position.z);

        raycaster.set(src, left.clone().sub(src).normalize());
        intersects = raycaster.intersectObjects(screen.children, false);
        if (intersects.length > 0) {
            left_marker.position.x = intersects[0].point.x;
            left_marker.position.y = intersects[0].point.y;
            left_marker.position.z = intersects[0].point.z;
        }

        raycaster.set(src, right.clone().sub(src).normalize());
        intersects = raycaster.intersectObjects(screen.children, false);
        if (intersects.length > 0) {
            right_marker.position.x = intersects[0].point.x;
            right_marker.position.y = intersects[0].point.y;
            right_marker.position.z = intersects[0].point.z;
        }
    }

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