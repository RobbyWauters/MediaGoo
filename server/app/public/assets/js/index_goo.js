require([
	'goo/entities/GooRunner',
	'goo/entities/EntityUtils',
	'goo/renderer/Material',
	'goo/renderer/Camera',
	'goo/entities/components/CameraComponent',
	'goo/entities/components/ScriptComponent',
	'goo/renderer/shaders/ShaderLib',
	'goo/renderer/MeshData',
	'goo/renderer/Util',
	'goo/renderer/pass/RenderPass',
	'goo/renderer/pass/BloomPass',
	'goo/renderer/pass/FullscreenPass',
	'goo/renderer/pass/Composer'
], function (GooRunner, EntityUtils, Material, Camera, CameraComponent, ScriptComponent, ShaderLib, MeshData, Util, RenderPass,	BloomPass, FullscreenPass, Composer) {
	"use strict";

    var bitmapArray = [];
    var imageArr = [];
    var LOOP = 200;
    var NUM_POINTS = LOOP * LOOP;
    var goo;
    var lastEntity;
    var xDir = 1;
    var yDir = 1;
    var xFactor = 0.005;
    var xDelta = 0;
    var yFactor = 0.008;
    var yDelta = 0;

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

    function initSocket(){
	    //socket IO:
	    if(!socket){
	        // socket.io initialiseren
	        socket = io.connect(window.location.hostname);
	        // some debugging statements concerning socket.io
	        socket.on('reconnecting', function(seconds){
	            console.log('reconnecting in ' + seconds + ' seconds');
	        });
	        socket.on('reconnect', function(){
	            console.log('reconnected');
	        });
	        socket.on('reconnect_failed', function(){
	            console.log('failed to reconnect');
	        });
	        socket.on('new', newContent);
	    }
	}

	function createPointCloud(){
		// Add points
		var pointsEntity = createBoxEntity(goo);
		lastEntity = pointsEntity
		xFactor = 0.003 + Math.random()*0.005;
		yFactor = 0.005 + Math.random()*0.005;
		// Add spin
		pointsEntity.setComponent(new ScriptComponent({
			run : function(entity) {
				// if(app && app.data){
				// console.log(app.data);
				var rotX = entity.transformComponent.getRotation().x;
				var rotY = entity.transformComponent.getRotation().y;

				if(rotX <= -0.8){
					xDir = 1;
					//xFactor = 0.003 + Math.random()*0.005;
				}else if(rotX >= 0.8){
					xDir = -1;
					//xFactor = 0.003 + Math.random()*0.005;
				}

				if(rotY <= -0.7){
					yDir = 1;
					//yFactor = 0.005 + Math.random()*0.005;
				}else if(rotY >= 0.7){
					yDir = -1;
					//yFactor = 0.005 + Math.random()*0.005;
				}

				if(xDir==1){
					xDelta+= 0.5+Math.random()*2.5;
				}else{
					xDelta-= 0.5+Math.random()*2.5;;
				}

				if(yDir==1){
					yDelta++;
				}else{
					yDelta--;
				}

				entity.transformComponent.transform.setRotationXYZ(
					xDelta * xFactor,
					yDelta * yFactor,
					0
				);

				// rotation between (-1,-0.7,0) and (1,0.7,0)


				entity.transformComponent.setUpdated();


				// }
                // audioData.guess
                //  Object {totalEnergy: 0.0002676707959839109, primaryNoteEnergy: 0.00005799675205730361, primaryNote: 14437.5}

                // audioData.spectrum
                //  Array[256]

                if (!audioData.spectrum) return;


                var verts = entity.meshDataComponent.meshData.getAttributeBuffer(MeshData.POSITION);
                var colors = entity.meshDataComponent.meshData.getAttributeBuffer(MeshData.COLOR);

                for (var i = 0; i < NUM_POINTS; i++) {

                    var sum = colors[i * 4 + 0] + colors[i * 4 + 1] + colors[i * 4 + 2];

                    verts[i * 3 + 2] = Math.sqrt(audioData.guess.primaryNoteEnergy * (sum * 10000000));
                }
                entity.meshDataComponent.meshData.vertexData._dataNeedsRefresh = true;
			}
		}));
		pointsEntity.addToWorld();
	}

	function newContent(data){
	    console.log(data);
	    if(lastEntity)
	    	lastEntity.removeFromWorld();
	    imageArr.push(data);
	    createPointCloud();
	}


	function init() {
		initSocket();
        loadImage();
		goo = new GooRunner({
			//showStats : true,
			//antiAlias : false
		});
		goo.renderer.domElement.id = 'goo';
		document.body.appendChild(goo.renderer.domElement);

		// createBloom(goo);

		goo.renderer.setClearColor(0,0,0,1);

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
		var count = 50000;
		var count = NUM_POINTS;

		var attributeMap = MeshData.defaultMap([MeshData.POSITION, MeshData.COLOR]);
		var meshData = new MeshData(attributeMap, count);
		meshData.indexModes = ['Points'];

		var verts = meshData.getAttributeBuffer(MeshData.POSITION);
		var colors = meshData.getAttributeBuffer(MeshData.COLOR);

		var n = 2000, n2 = n / 2;
        var cnt = 0;

        for (var i = LOOP; i >= 0; i--) {
            for (var j = 0; j < LOOP; j++) {
                var multX = j/LOOP;
                var multY = i/LOOP;

                var x = multX * n - n2;
			    var y = multY * n - n2;

			    var z = 1;

                verts[cnt * 3 + 0] = x;
                verts[cnt * 3 + 1] = y;
                verts[cnt * 3 + 2] = z;

                colors[cnt * 4 + 0] = imageArr[imageArr.length-1][cnt*3+0]/255;
                colors[cnt * 4 + 1] = imageArr[imageArr.length-1][cnt*3+1]/255;
                colors[cnt * 4 + 2] = imageArr[imageArr.length-1][cnt*3+2]/255;
                colors[cnt * 4 + 3] = 1.0;

                cnt++;
            }
        }


		var entity = EntityUtils.createTypicalEntity(goo.world, meshData);
		entity.transformComponent.transform.translation.z = -2750;

		var material = new Material('TestMaterial');
		material.shader = Material.createShader(Util.clone(ShaderLib.point), 'PointShader');
		entity.meshRendererComponent.materials.push(material);

		return entity;
	}

	function createBloom(goo) {
		var composer = new Composer();

		var renderPass = new RenderPass(goo.world.getSystem('RenderSystem').renderList);
		// renderPass.clearColor = (1,0,0,1);
		var bloomPass = new BloomPass();
		// Create composer with same size as screen

		var shader = Util.clone(ShaderLib.bloom);
		var outPass = new FullscreenPass(shader);

		composer.addPass(renderPass);
		composer.addPass(bloomPass);

		goo.world.getSystem('RenderSystem').composers.push(composer);
	}

	init();

});
