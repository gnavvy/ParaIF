// ***** call from server *****
now.setHands = function(hands) { _hands = hands; };
now.ready(function() { now.start(); });
now.update = function() { init(); animate(); };
// ***** call from server *****

var W, H, w, h;
var canvas, camera, scene, renderer, projector, stats;  // basic
var screen, floor;
var trackball, plane;
var _hands;
var _historyIdx = -1;
var stickerColors = [0x666666, 0x1D8C00, 0x4575D4, 0xE5FB00, 0xDDDDDD, 0xEC0033, 0xFF6501];
// 1-left-green, 2-right-blue, 3-top-yellow, 4-bottom-white, 5-front-red, 6-back-orange

//var blockFaces =   [[1, 0, 3, 0, 5, 0], [0, 2, 3, 0, 5, 0],
var blockFaces =   [[1, 2, 3, 3, 5, 6], [0, 2, 3, 0, 5, 0],
                    [1, 0, 0, 4, 5, 0], [0, 2, 0, 4, 5, 0],
                    [1, 0, 3, 0, 0, 6], [0, 2, 3, 0, 0, 6],
                    [1, 0, 0, 4, 0, 6], [0, 2, 0, 4, 0, 6]];
var objects = [];
var mouse = new THREE.Vector2();
var offset = new THREE.Vector3();
var v3 = new THREE.Vector3();
var INTERSECTED, SELECTED;
var print = console.log.bind(console);

function init() {
    initCanvas();
    initScene();
    initLighting();
    initRubix();
}

function initRubix() {
    var modifier = new THREE.SubdivisionModifier(2);
    var r = 300;
    var offsets = [[-r/2, 0, 0], [r/2, 0, 0], [0, r/2, 0], [0, -r/2, 0], [0, 0, r/2], [0, 0, -r/2]];
    var rotates = [[0, 0.5, 0], [0, 0.5, 0], [0.5, 0, 0], [0.5, 0, 0], [0, 0, 0.5], [0, 0, 0.5]];

    for (var n = 0; n < 1; n++) {
        var unitCubeGeometry = new THREE.CubeGeometry(r, r, r, 10, 10, 10);
        var stickersGeometry = new THREE.CubeGeometry(r*0.9, r*0.9, 5, 10, 10, 1);

        modifier.modify(unitCubeGeometry);
        modifier.modify(stickersGeometry);
        for (var i = 0; i < unitCubeGeometry.faces.length; i++) {
            unitCubeGeometry.faces[i].color.setHex(stickerColors[blockFaces[n][i]]);
        }
        var plastic = new THREE.MeshPhongMaterial({
            color:      0x101010,
            specular:   0xA0A0A0,
            shininess:  20
        });

        var shinyPaper = new THREE.MeshPhongMaterial({
            specular:   0xFFFFFF,
            shininess:  10
        });

        var unitCube = new THREE.Mesh(unitCubeGeometry, plastic);
        unitCube.castShadow = false;
        unitCube.receiveShadow = false;

        for (var f = 0; f < 6; f++) {  // six faces
            if (blockFaces[n][f] == 0) { // inner surface
                continue;
            }
            var coloredShinyPaper = shinyPaper.clone();
            coloredShinyPaper.color.setHex(stickerColors[blockFaces[n][f]]);

            var sticker = new THREE.Mesh(stickersGeometry, coloredShinyPaper); {
                sticker.position.copy(v3.addVectors(unitCube.position, v3.fromArray(offsets[f])));
                sticker.rotation.copy(v3.addVectors(unitCube.rotation, v3.fromArray(rotates[f]).multiplyScalar(Math.PI)));
            }
            unitCube.add(sticker);
        }
        scene.add(unitCube);
        objects.push(unitCube);
    }
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
    renderer.sortObjects = false;
    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFShadowMap;
    renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
    renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
    renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false);
    canvas.appendChild(renderer.domElement);

    // Stats
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    canvas.appendChild(stats.domElement);

    // Projector
    projector = new THREE.Projector();
}

function initScene() {
    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(45, W / H, 1, 10000);
    camera.position.set(0, 500, 2000);
    camera.lookAt(scene.position);
    scene.add(camera);

    // Trackball
    trackball = new THREE.TrackballControls(camera);
    trackball.rotateSpeed = 1.0;
    trackball.zoomSpeed = 1.2;
    trackball.panSpeed = 0.8;
    trackball.noZoom = false;
    trackball.noPan = false;
    trackball.staticMoving = true;
    trackball.dynamicDampingFactor = 0.3;
    trackball.addEventListener('change', render);

    // Axis
    var axis = new THREE.AxisHelper(100);
    axis.position.set(0, 0, 0);
    scene.add(axis);

    // Floor
    floor = new THREE.Mesh(
        new THREE.PlaneGeometry(w*20, w*20, w/5, w/5),
        new THREE.MeshBasicMaterial({ color: 0xcccccc, wireframe: true })
    );
    floor.rotation.x = -Math.PI/2;
    scene.add(floor);

    // Hit Plane
    plane = new THREE.Mesh(
        new THREE.PlaneGeometry(2000, 2000, 8, 8),
        new THREE.MeshBasicMaterial({color: 0x000000, opacity: 0.25, transparent: true, wireframe: true})
    );
    plane.visible = false;
    scene.add(plane);
}

function initLighting() {
    var light1 = new THREE.DirectionalLight(0xffffff, 1); {
        light1.position.set(0, 500, 500);
        light1.castShadow = true;
        light1.shadowCameraNear = 200;
        light1.shadowCameraFar = camera.far;
        light1.shadowCameraFov = 50;
        light1.shadowBias = -0.00022;
        light1.shadowDarkness = 0.5;
        light1.shadowMapWidth = 2048;
        light1.shadowMapHeight = 2048;
    }
    var light2 = light1.clone(); {
        light2.intensity = 0.5;
        light2.position.set(-500, -500, -500);
    }
    var light3 = light1.clone(); {
        light3.intensity = 0.3;
        light3.position.set(500, -500, -500);
    }

    scene.add(light1);
    scene.add(light2);
    scene.add(light3);
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
    var numHands = _hands === undefined ? 0 : hands.length;
    if (numHands > 0) {
        objects[0].position.fromArray(_hands[0].stabilizedPalmPosition);
        objects[0].rotation.fromArray(_hands[0].direction);
    }

    renderer.render(scene, camera);
}

function onWindowResize() {
    W = window.innerWidth;  H = window.innerHeight;
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    renderer.setSize(W, H);
}

function onDocumentMouseMove( event ) {
    event.preventDefault();

    mouse.x =  (event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    projector.unprojectVector(vector, camera);

    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

    if (SELECTED) {
        var intersects = raycaster.intersectObject(plane);
        SELECTED.position.copy(intersects[0].point.sub(offset));
        return;
    }

    var candidates = raycaster.intersectObjects(objects, true);
    if (candidates.length > 0) {
        if (INTERSECTED != candidates[0].object) {
            if (INTERSECTED) {
                INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
            }
            INTERSECTED = candidates[0].object;
            while (!(INTERSECTED.parent instanceof THREE.Scene)) {  // select group
                INTERSECTED = INTERSECTED.parent;
            }
            INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
            plane.position.copy(INTERSECTED.position);
            plane.lookAt(camera.position);  // face to the user
        }

        canvas.style.cursor = 'pointer';

    } else {
        if (INTERSECTED) {
            INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
        }
        INTERSECTED = null;
        canvas.style.cursor = 'auto';
    }
}

function onDocumentMouseUp(event) {
    event.preventDefault();
    trackball.enabled = true;
    if (INTERSECTED) {
        plane.position.copy( INTERSECTED.position );
        SELECTED = null;
    }
    canvas.style.cursor = 'auto';

}

function onDocumentMouseDown(event) {
    event.preventDefault();
    var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
    projector.unprojectVector(vector, camera);
    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
    var candidates = raycaster.intersectObjects(objects, true);
    if (candidates.length > 0) {
        trackball.enabled = false;
        SELECTED = candidates[0].object;  // first hit object
        while (!(SELECTED.parent instanceof THREE.Scene)) {  // select group
            SELECTED = SELECTED.parent;
        }
        var intersects = raycaster.intersectObject(plane);
        offset.copy(intersects[0].point).sub(plane.position);
        canvas.style.cursor = 'move';
    }
}