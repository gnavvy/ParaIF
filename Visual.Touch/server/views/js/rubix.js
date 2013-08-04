// ***** call from server *****
now.setData = function(data) { _data = data; };
now.ready(function() { now.start(); });
now.update = function() { init(); animate(); };
// ***** call from server *****

var W, H, w, h;
var canvas, camera, scene, renderer, projector, stats;  // basic
var screen, floor;
var trackball, plane;
var _data;
var _historyIdx = -1;
var rubix_count = 8;
var rubix_color = [0x666666, 0x1D8C00, 0x4575D4, 0xE5FB00, 0xDDDDDD, 0xEC0033, 0xFF6501];
var faceColors =   [[ 20, 20, 20],  // inner: gray [r,g,b]
                    [255,210,  0],  // right: yellow
                    [  0, 51,115],  // up   : blue
                    [140,  0, 15],  // front: red
                    [248,248,248],  // left : white
                    [  0,115, 47],  // down : green
                    [255, 70,  0]]; // back : orange
var rubix_faces =  [[1, 0, 3, 0, 5, 0], [0, 2, 3, 0, 5, 0],
                    [1, 0, 0, 4, 5, 0], [0, 2, 0, 4, 5, 0],
                    [1, 0, 3, 0, 0, 6], [0, 2, 3, 0, 0, 6],
                    [1, 0, 0, 4, 0, 6], [0, 2, 0, 4, 0, 6]];
var objects = [];
var mouse = new THREE.Vector2();
var offset = new THREE.Vector3();
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
    var offsets = [[-r/2, 0, 0], [r/2, 0, 0], [0, r/2, 0], [0, -r/2, 0], [0, 0, -r/2], [0, 0, r/2]];
    var rotates = [[0, 0, 0], [0, 0, 0], [0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [0, 0, 0.5], [0, 0, 0.5]];

    for (var n = 0; n < 1; n++) {
        var blockGeometry = new THREE.CubeGeometry(r, r, r, 10, 10, 10);
        var stickerGeometry = new THREE.CubeGeometry(r*0.9, r*0.9, 5, 10, 10, 1);

        modifier.modify(blockGeometry);
        modifier.modify(stickerGeometry);
        for (var i = 0; i < blockGeometry.faces.length; i++) {
            var face_color_id = rubix_faces[n][i];
            blockGeometry.faces[i].color.setHex(rubix_color[face_color_id]);
//            blockGeometry.faces[i].color.setHex(0xfffff * i / blockGeometry.faces.length);
        }
        var plastic = new THREE.MeshPhongMaterial({
            transparent: true, opacity: 0.9,
            ambient:    0xF0F0F0,
            color:      0x101010, // diffuse
            specular:   0xF0F0F0,
            shininess:  20
        });

        var shinnyPaper = new THREE.MeshPhongMaterial({
//            ambient:    0xF0F0F0,
            specular:   0xF0F0F0,
            shininess:  10
        });

        var block = new THREE.Mesh(blockGeometry, plastic);
        block.castShadow = true;
        block.receiveShadow = false;

        for (var f = 0; f < 6; f++) {
            var fid = rubix_faces[n][f];
            if (fid == 0) { // inner surface
                continue;
            }
            var coloredShinnyPaper = shinnyPaper.clone();
            coloredShinnyPaper.color.setHex(rubix_color[fid]);

            var sticker = new THREE.Mesh(stickerGeometry, coloredShinnyPaper);
            sticker.position.x = block.position.x + offsets[f][0];
            sticker.position.y = block.position.y + offsets[f][1];
            sticker.position.z = block.position.z + offsets[f][2];
//            sticker.rotation.x = 0.5 * Math.PI;
//            sticker.rotation.y = 0.5 * Math.PI;
//            sticker.rotation.z = 0.5 * Math.PI;
            sticker.rotation.x = block.rotation.x + rotates[f][0] * Math.PI;
            sticker.rotation.y = block.rotation.y + rotates[f][1] * Math.PI;
            sticker.rotation.z = block.rotation.z + rotates[f][2] * Math.PI;
            block.add(sticker);
//            sticker.add(block);
        }

//        var sticker = new THREE.Mesh(stickerGeometry, shinnyPaper);
//        var offset = new THREE.Vector3(0, 0, r/2);
//        sticker.position.x = block.position.x + offset.x;
//        sticker.position.y = block.position.y + offset.y;
//        sticker.position.z = block.position.z + offset.z;
//        sticker.rotation.x = block.rotation.x;
//        sticker.rotation.y = block.rotation.y;
//        sticker.rotation.z = block.rotation.z;

//        block.add(sticker);

//        block.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
//        block.position.set(Math.random() * W * 2 - W, Math.random() * W * 2 - W, Math.random() * W + 0.1 * W);

        scene.add(block);

        objects.push(block);

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
    var hands = _data;
    var numHands = hands === undefined ? 0 : hands.length;
    if (numHands > 0) {
        objects[0].position.fromArray(hands[0].stabilizedPalmPosition);
        objects[0].rotation.fromArray(hands[0].direction);
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