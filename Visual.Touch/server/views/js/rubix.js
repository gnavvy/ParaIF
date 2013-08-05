var rubix = { cubes: {} };  // rubix factory

rubix.createCube = function(id) {
    id = id < 0 || id > 7 ? 0 : id;

    // 0-inner-gray, 1-left-green, 2-right-blue, 3-top-yellow, 4-bottom-white, 5-front-red, 6-back-orange
    var stickerColors = [0x666666, 0x1D8C00, 0x4A8CF5, 0xE5FB00, 0xDDDDDD, 0xEC0033, 0xFF6501];
    var unitCubeFaces = [[1, 2, 3, 3, 5, 6],  // sample cube
                         [1, 0, 3, 0, 5, 0], [0, 2, 3, 0, 5, 0],
                         [1, 0, 0, 4, 5, 0], [0, 2, 0, 4, 5, 0],
                         [1, 0, 3, 0, 0, 6], [0, 2, 3, 0, 0, 6],
                         [1, 0, 0, 4, 0, 6], [0, 2, 0, 4, 0, 6]];
    var r = 300;
    var offsets = [[-r/2, 0, 0], [r/2, 0, 0], [0, r/2, 0], [0, -r/2, 0], [0, 0, r/2], [0, 0, -r/2]];
    var rotates = [[0, 0.5, 0], [0, 0.5, 0], [0.5, 0, 0], [0.5, 0, 0], [0, 0, 0.5], [0, 0, 0.5]];

    var modifier = new THREE.SubdivisionModifier(2);

    // cube body
    var unitCubeGeometry = new THREE.CubeGeometry(r, r, r, 10, 10, 10);
    modifier.modify(unitCubeGeometry);  // body with round conner
    var plastic = new THREE.MeshPhongMaterial({ color: 0x101010, specular: 0xA0A0A0, shininess: 20 });
    var unitCube = new THREE.Mesh(unitCubeGeometry, plastic);


    // stickers
    var stickersGeometry = new THREE.CubeGeometry(r*0.9, r*0.9, 5, 10, 10, 1);
    modifier.modify(stickersGeometry);  // sticker with round conner
    var shinyPaper = new THREE.MeshPhongMaterial({ specular: 0xFFFFFF, shininess: 10 });

    for (var f = 0; f < 6; f++) {  // six faces
        if (unitCubeFaces[id][f] === 0) continue;  // no sticker for inner surfaces
        var coloredShinyPaper = shinyPaper.clone();
        coloredShinyPaper.color.setHex(stickerColors[unitCubeFaces[id][f]]);

        var sticker = new THREE.Mesh(stickersGeometry, coloredShinyPaper); {
            sticker.position.copy(v3.addVectors(unitCube.position, v3.fromArray(offsets[f])));
            sticker.rotation.copy(v3.addVectors(unitCube.rotation, v3.fromArray(rotates[f]).multiplyScalar(Math.PI)));
        }
        unitCube.add(sticker);  // group cube and sticker
    }

    this.cubes[id] = unitCube;  // add to cube list for later use
    return this.cubes[id];
}