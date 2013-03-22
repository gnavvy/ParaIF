//function drawEdges() {
//    var edgeLength = _edges.length;
//    edgeGeometry = new THREE.BufferGeometry();
//    edgeGeometry.attributes = {  // index: i;  position: xyz * 2 vertices;  color: rgb * 2 vertices;
//        position:   { itemSize: 3, array: new Float32Array(edgeLength*3*2), numItems: edgeLength*3*2 },
//        color:      { itemSize: 3, array: new Float32Array(edgeLength*3*2), numItems: edgeLength*3*2 }
//    };
//
//    var positions = edgeGeometry.attributes.position.array;
//    var colors = edgeGeometry.attributes.color.array;
//
//    for (var e = 0; e < edgeLength; e++) {
//        var source = _nodes[_edges[e].source];
//        var target = _nodes[_edges[e].target];
//        var sourcePos = source.positions[layout[_degree][source.cluster]];
//        var targetPos = target.positions[layout[_degree][target.cluster]];
//        var sourceColor = new THREE.Color(colormap[source.label % colormap.length]);
//        var targetColor = new THREE.Color(colormap[target.label % colormap.length]);
//        positions[e*6+0] = sourcePos[0]*W; positions[e*6+1] = sourcePos[1]*H; positions[e*6+2] = 0;
//        positions[e*6+3] = targetPos[0]*W; positions[e*6+4] = targetPos[1]*H; positions[e*6+5] = 0;
//        colors[e*6+0] = sourceColor.r; colors[e*6+1] = sourceColor.g; colors[e*6+2] = sourceColor.b;
//        colors[e*6+3] = targetColor.r; colors[e*6+4] = targetColor.g; colors[e*6+5] = targetColor.b;
//    }
//
//    edgeMaterial = new THREE.LineBasicMaterial({
//        transparent: false, blending: THREE.NoBlending, vertexColors: THREE.VertexColors
//    });
//
//    edges = new THREE.Line(edgeGeometry, shaderMaterial, THREE.LinePieces);
//    scene.add(edges);
//}

//var colors = [0xF81F37, 0xF8981F, 0xEECF09, 0x8FD952, 0x0D9FD8, 0x8C71D1, 0xF640AE];