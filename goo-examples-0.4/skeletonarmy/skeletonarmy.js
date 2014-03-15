require.config({
	baseUrl: "./",
	paths: {
		'goo': '/js/goo',
		'goo/lib': '/js/goo/lib'
	}
});
require([
	'goo/entities/GooRunner',
	'goo/math/Vector3',

	'goo/renderer/Camera',
	'goo/entities/components/CameraComponent',
	'goo/renderer/light/DirectionalLight',
	'goo/entities/components/LightComponent',
	'goo/entities/components/ScriptComponent',
	'goo/scripts/OrbitCamControlScript',

	'goo/loaders/DynamicLoader',

	'goo/entities/EntityUtils',
	'goo/util/Skybox',
	'goo/util/rsvp',
	'goo/shapes/ShapeCreator',
	'goo/renderer/Material',
	'goo/renderer/Shader',
	'goo/renderer/Util'
], function(
	GooRunner,
	Vector3,

	Camera,
	CameraComponent,
	DirectionalLight,
	LightComponent,
	ScriptComponent,
	OrbitCamControlScript,

	DynamicLoader,

	EntityUtils,
	Skybox,
	RSVP,
	ShapeCreator,
	Material,
	Shader,
	Util
) {
	"use strict";

	// Put some variables in outer scope so we can reach them
	var floorMaterial;
	var animComps = [];
	var walking;

	function init() {
		var goo = createWorld();
		loadSkeletons(goo).then(null, function(e) {
			console.log(e, e.message);
		});
		
		// Add user interaction
		walking = true;
	}

	var buttons = document.querySelectorAll('.button');

	var actions = [
		function (event) {
			for (var i = 0; i < animComps.length; i++) {
				var component = animComps[i];
				delayTransition(component, walking ? "run" : "walk");
			}
			walking = !walking;

			return false;
		},
		function (event) {
			for (var i = 0; i < animComps.length; i++) {
				var component = animComps[i];
				component.layers[1].setCurrentStateByName('punch_right', true);
			}
			return false;
		}
	];

	for (var i = 0; i < buttons.length; i++) {
		buttons[i].addEventListener('mousedown', actions[i]);
		buttons[i].addEventListener('touchstart', actions[i]);
	}

	document.addEventListener('keydown', function (e) {
		e = window.event || e;
		var code = e.charCode || e.keyCode;
		if (code === 32) { // space bar
			actions[0]();
		} else if (code === 13) { // enter
			actions[1]();
		}
	}, false);


	// Delaying animation transition randomly
	function delayTransition(component, anim) {
		setTimeout(function() {
			component.transitionTo(anim);
			setTimeout(function () {
				floorMaterial.uniforms.moveX = (anim === "run") ? 2.0 : 0.65;
			}, 600);

		}, Math.round(1000*Math.random()));
	}

	var _clones = {};


	// Loading the skeleton scene, then duplicating it and placing them in the world
	function loadSkeletons(goo) {
		var rows = +getURLParam('rows') || 8;
		var cols = +getURLParam('cols') || 8;
		var positions = [];
		var skeletonCount = +getURLParam('skeletons') || 5;

		// Skeletonpositions
		for (var i = 0; i < rows; i++) {
			for (var j = 0; j < cols; j++) {
				var x = j-(cols-1)/2;
				var y = i-(rows-1)/2;
				var posX = x*50 + 10*(Math.random()-1) - cols/3*50;
				var posZ = y*50 + 40*(Math.random()-1);
				positions.push([posX, 0, posZ]);
			}
		}

		// Skeleton config
		var loader = new DynamicLoader({ rootPath: '../resources/skeleton/', world: goo.world });
		return loader._loadRef('skeleton.bundle').then(function(bundle) {
			var keys = [];
			var newkeys = [];
			for (var key in bundle) {
				if (key.indexOf('.entity') > -1) {
					keys.push(key);
				}
			}
		
			// Cloning the skeleton config
			var skeletons = Math.ceil(rows*cols / skeletonCount);
			var share = false;
			for(var i = 0; i < rows; i++) {
				for (var j = 0; j < cols; j++) {
					if((i+j)>0 && (i*cols + j) % skeletons === 0) {
						share = false
					} else {
						share = true;
					}

					var randPos = Math.floor(Math.random()*positions.length);
					var newPos = positions.splice(randPos, 1)[0];
					for (var k = 0; k < keys.length; k++) {
						if (i === 0 && j === 0) {
							if(!bundle[keys[k]].components.transform.parentRef) {
								bundle[keys[k]].components.transform.translation = newPos;
							}
						} else {
							if(share) {
								cloneConfig(keys[k], bundle, true, newPos);
							} else {
								newkeys[k] = cloneConfig(keys[k], bundle, false, newPos);
							}
						}
					}
					if (share === false) {
						keys = newkeys;
					}
				}
			}
			return loader.loadFromBundle('skeleton.scene', 'skeleton.bundle')
		}).then(function(configs) {
			for (var key in configs) {
				if (configs[key].components && configs[key].components.animation) {
					var animComp = loader.getCachedObjectForRef(key).animationComponent;
					animComp.resetClips(goo.world.time - Math.random());
					animComps.push(animComp);
				}
			}
		});
	}
	
	function createWorld() {
		var goo = new GooRunner({
			antialias: true,
			showStats: false
		});
		goo.renderer.domElement.id = 'goo';
		goo.renderer.setClearColor(0, 0, 0, 1);
		document.body.appendChild(goo.renderer.domElement);


		// Camera
		var camera = new Camera(45, 1, 1, 5000);
		var cameraEntity = goo.world.createEntity('CameraEntity');
		cameraEntity.addToWorld();
		cameraEntity.setComponent(new CameraComponent(camera));

		// Camera control
		var scripts = new ScriptComponent();
		scripts.scripts.push(new OrbitCamControlScript({
			domElement : goo.renderer.domElement,
			baseDistance : 800/4,
			spherical : new Vector3(600, -Math.PI/3 , Math.PI/12),
			minAscent: Math.PI/18,
			maxAscent: Math.PI/3,
			minZoomDistance: 15,
			maxZoomDistance: 700
		}));
		cameraEntity.setComponent(scripts);

		// Light
		var light = new DirectionalLight();
		var entity = goo.world.createEntity('Light');
		entity.setComponent(new LightComponent(light));
		entity.transformComponent.transform.translation.set(0, 10, 1000);
		entity.transformComponent.transform.lookAt(Vector3.ZERO, Vector3.UNIT_Y)
		entity.addToWorld();
		
		// Skybox
		// Load skybox
		var loader = new DynamicLoader({
			rootPath: '../resources/skybox/',
			world: goo.world
		});
		loader.load('skybox.scene');
		
		// Ground
		var meshData = ShapeCreator.createQuad(10000, 10000, 100, 100);
		var entity = EntityUtils.createTypicalEntity(goo.world, meshData);
		entity.transformComponent.transform.setRotationXYZ(-Math.PI / 2, 0, 0);

		var loader = new DynamicLoader({ rootPath: '../resources/desert/', world: goo.world });
		loader.load('materials/desert.material').then(function() {
			var material = floorMaterial = loader.getCachedObjectForRef('materials/desert.material');
			entity.meshRendererComponent.materials.push(material);
			entity.addToWorld();
		});

		return goo;
	}
	
	function getURLParam(name) {
		var re = new RegExp('[\?&]'+name+'=([^\?&]+)');
		var m = window.location.href.match(re);
		return (m) ? m[1] : null;
	}

	function cloneConfig(origRef, bundle, shareAnim, pos) {
		var original = bundle[origRef];
		_clones[origRef] = _clones[origRef] || 0;
		_clones[origRef]++
		if(!original) {
			return;
		}
		var clone = Util.clone(original);
		var refs = origRef.split('.');
		var cloneRef = getCloneName(origRef, _clones[origRef]);
		bundle[cloneRef] = clone;

		if (refs[1] === 'entity') {
			bundle['skeleton.scene'].entityRefs.push(cloneRef);
			if (original.components) {
				if(original.components.animation) {
					if(shareAnim) {
						delete clone.components.animation;
					} else {
						clone.components.animation.layersRef = cloneConfig(original.components.animation.layersRef, bundle);
						clone.components.animation.poseRef = cloneConfig(original.components.animation.poseRef, bundle);
					}
				}
				if (original.components.meshRenderer && !shareAnim) {
					for (var i = 0; i < original.components.meshRenderer.materialRefs.length; i++) {
						clone.components.meshRenderer.materialRefs[i] 
							= cloneConfig(original.components.meshRenderer.materialRefs[i], bundle);
					}
				}
				if (original.components.meshData && original.components.meshData.poseRef && !shareAnim) {
					clone.components.meshData.poseRef = getCloneName(original.components.meshData.poseRef, _clones[original.components.meshData.poseRef]);
				}
				if (original.components.transform) {
					if (original.components.transform.parentRef) {
						clone.components.transform.parentRef = getCloneName(original.components.transform.parentRef, _clones[origRef]);
					} else {
						clone.components.transform.translation = pos;
					}
				}
			}
		}
		return cloneRef;
	}
	
	function getCloneName(ref, idx) {
		var refs = ref.split('.');
		return refs[0] + '_' + idx + '.' + refs[1];
	}
	init();
});
