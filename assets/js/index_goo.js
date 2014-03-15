require([
	'goo/entities/GooRunner',
	'goo/entities/EntityUtils',
	'goo/renderer/Material',
	'goo/renderer/Camera',
	'goo/entities/components/CameraComponent',
	'goo/entities/components/ScriptComponent',
	'goo/renderer/shaders/ShaderLib',
	'goo/renderer/MeshData',
	'goo/renderer/Util'
], function (GooRunner, EntityUtils, Material, Camera, CameraComponent, ScriptComponent, ShaderLib, MeshData, Util) {
	"use strict";

    var bitmapArray = [];
    var LOOP = 50;
    var NUM_POINTS = LOOP * LOOP;

    function loadImage(){
        for (var i = 0; i < NUM_POINTS; i++) {
            bitmapArray[i] = Array(LOOP);
        }
//        console.log(bitmapArray);

        for (var i = 0; i < LOOP; i++) {
            for (var j = 0; j < LOOP; j++) {
                bitmapArray[i][j] = "#" + (0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
            }
        }
    }

	function init() {
        loadImage();
		var goo = new GooRunner({
			//showStats : true,
			//antiAlias : false
		});
		goo.renderer.domElement.id = 'goo';
		document.body.appendChild(goo.renderer.domElement);

		goo.renderer.setClearColor(0,0,0,1);

		// Add points
		var pointsEntity = createBoxEntity(goo);

		// Add spin
		pointsEntity.setComponent(new ScriptComponent({
			run : function(entity) {
<<<<<<< HEAD
				// if(app && app.data){
					// console.log(app.data);
					entity.transformComponent.transform.setRotationXYZ(
						entity._world.time * 0.3,
						entity._world.time * 0.6,
						0
					);


					if(audioData && audioData.spectrum){
						entity.transformComponent.setScale(
							0.5+audioData.guess.totalEnergy*500,
							0.5+audioData.guess.totalEnergy*500,
							0.5+audioData.guess.totalEnergy*500
						);
					}
						// console.log(audioData.guess);

					// entity.transformComponent.setScale(
					// 	app.data,
					// 	app.data,
					// 	app.data
					// );

					entity.transformComponent.setUpdated();

					// var verts = entity.meshDataComponent.meshData.getAttributeBuffer(MeshData.POSITION);
					// for (var i = 0; i < 500000; i++) {
					// 	var x = (Math.random()-0.5)*5.0*app.data[1];
					// 	// var y = (Math.random()-0.5)*5.0;
					// 	// var z = (Math.random()-0.5)*5.0;

					// 	verts[i * 3 + 0] += x;
					// 	// verts[i * 3 + 1] += y;
					// 	// verts[i * 3 + 2] += z;
					// }
					// entity.meshDataComponent.meshData.vertexData._dataNeedsRefresh = true;
				// }
=======
                // audioData.guess
                //  Object {totalEnergy: 0.0002676707959839109, primaryNoteEnergy: 0.00005799675205730361, primaryNote: 14437.5}

                // audioData.spectrum
                //  Array[256]


                //entity.transformComponent.transform.setS

                entity.transformComponent.transform.setRotationXYZ(
                    entity._world.time * 0.3,
                    entity._world.time * 0.6,
                    0
                );

                entity.transformComponent.setUpdated();

                if (!audioData.spectrum) return;


                var verts = entity.meshDataComponent.meshData.getAttributeBuffer(MeshData.POSITION);
                var colors = entity.meshDataComponent.meshData.getAttributeBuffer(MeshData.COLOR);

                for (var i = 0; i < NUM_POINTS; i++) {
//                    var x = (Math.random()-0.5)*5.0;
//                    var y = (Math.random()-0.5)*5.0;
//                    var z = (Math.random()-0.5)*5.0;

//                	var x = audioData.spectrum[i] * 10;
//                	var y = audioData.spectrum[i] * 10;
//                	var z = audioData.spectrum[i] * 10;
//                  var x = audioData.spectrum[Math.floor(Math.random() * 256)] * 10;
//                	var y = audioData.spectrum[Math.floor(Math.random() * 256)] * 10;
//                	var z = audioData.spectrum[Math.floor(Math.random() * 256)] * 10;

//                	verts[i * 3 + 0] = x;
//                	verts[i * 3 + 1] = y;
//                	verts[i * 3 + 2] = audioData.spectrum[i] * 10;

//                	verts[i] = audioData.spectrum[i] * 10;
//                    console.log(audioData.guess.totalEnergy);

                    var sum = colors[i * 4 + 0] + colors[i * 4 + 1] + colors[i * 4 + 2];

                    verts[i * 3 + 2] = audioData.guess.totalEnergy * 1000 * (sum * 100);
                }
                entity.meshDataComponent.meshData.vertexData._dataNeedsRefresh = true;
>>>>>>> RGB plane visualizer
			}
		}));
		pointsEntity.addToWorld();

		// Add camera
		var camera = new Camera(45, 1, 5, 3500);
		var cameraEntity = goo.world.createEntity("CameraEntity");
		cameraEntity.setComponent(new CameraComponent(camera));
		cameraEntity.addToWorld();
	}

    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16) / 255,
            g: parseInt(result[2], 16) / 255,
            b: parseInt(result[3], 16) / 255
        } : null;
    }

	function createBoxEntity(goo) {
<<<<<<< HEAD
		var count = 50000;
=======
		var count = NUM_POINTS;
>>>>>>> RGB plane visualizer

		var attributeMap = MeshData.defaultMap([MeshData.POSITION, MeshData.COLOR]);
		var meshData = new MeshData(attributeMap, count);
		meshData.indexModes = ['Points'];

		var verts = meshData.getAttributeBuffer(MeshData.POSITION);
		var colors = meshData.getAttributeBuffer(MeshData.COLOR);

		var n = 2000, n2 = n / 2;
        var cnt = 0;

        for (var i = 0; i < LOOP; i++) {
            for (var j = 0; j < LOOP; j++) {
                var multX = j/LOOP;
                var multY = i/LOOP;

                var x = multX * n - n2;
			    var y = multY * n - n2;

			    var z = 1;

                verts[cnt * 3 + 0] = x;
                verts[cnt * 3 + 1] = y;
                verts[cnt * 3 + 2] = z;

                var rgb = hexToRgb(bitmapArray[i][j]);

                colors[cnt * 4 + 0] = rgb.r;
                colors[cnt * 4 + 1] = rgb.g;
                colors[cnt * 4 + 2] = rgb.b;
                colors[cnt * 4 + 3] = 1.0;

                cnt++;
            }
        }

		/*for (var i = 0; i < count; i++) {
			var x = Math.random() * n - n2;
			var y = Math.random() * n - n2;
			var z = 1; //Math.random() * n - n2;

			verts[i * 3 + 0] = x;
			verts[i * 3 + 1] = y;
			verts[i * 3 + 2] = z;
			var l = (Math.max(x*x, y*y, z*z) / (n2*n2)) * 0.8 + 0.2;

            *//*var vx = (x / n) + 0.5;
			var vy = (y / n) + 0.5;
			var vz = (z / n) + 0.5;

			colors[i * 4 + 0] = vx * l;
			colors[i * 4 + 1] = vy * l;
			colors[i * 4 + 2] = vz * l;
			colors[i * 4 + 3] = 1.0;*//*

            colors[i * 4 + 0] = 1.0;
            colors[i * 4 + 1] = 1.0;
            colors[i * 4 + 2] = 1.0;
            colors[i * 4 + 3] = 1.0;
		}*/

		var entity = EntityUtils.createTypicalEntity(goo.world, meshData);
		entity.transformComponent.transform.translation.z = -2750;

		var material = new Material('TestMaterial');
		material.shader = Material.createShader(Util.clone(ShaderLib.point), 'PointShader');
		entity.meshRendererComponent.materials.push(material);

		return entity;
	}

	init();
});
