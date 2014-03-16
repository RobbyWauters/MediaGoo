require({
    // configure our AMD loader
    baseUrl: 'assets/lib'
    },
    ['goo'], function() {
    require([
        'goo/entities/GooRunner',
        'goo/entities/EntityUtils',
        'goo/renderer/Material',
        'goo/renderer/Camera',
        'goo/entities/components/CameraComponent',
        'goo/shapes/ShapeCreator',
        'goo/entities/components/ScriptComponent',
        'goo/scripts/WASDControlScript',
        'goo/renderer/TextureCreator',
        'goo/renderer/shaders/ShaderLib',
        'goo/entities/World',
        'goo/renderer/light/PointLight',
        'goo/entities/components/LightComponent'
    ], function(
        GooRunner,
	    EntityUtils,
	    Material,
	    Camera,
	    CameraComponent,
	    ShapeCreator,
	    ScriptComponent,
	    TextureCreator,
	    ShaderLib,
	    World,
	    PointLight,
	    LightComponent
    ) {
    	"use strict";

    	// Initialize
        var goo = new GooRunner(
        	{showStats : true}
    	);
		document.body.appendChild(goo.renderer.domElement);

		// Camera
		var camera = new Camera(35, 1, 0.1, 1000);
		var cameraEntity = goo.world.createEntity('Camera');
		cameraEntity.setComponent(new CameraComponent(camera));
		cameraEntity.setComponent(new ScriptComponent(WASDControlScript()));
		cameraEntity.transformComponent.transform.translation.set(0, 0, 5);
		cameraEntity.addToWorld();

		// Light
		var light = new PointLight();
        var lightEntity = goo.world.createEntity('light');
        lightEntity.setComponent(new LightComponent(light));
        lightEntity.transformComponent.transform.translation.set(0, 3, 3);
        lightEntity.addToWorld();



        for (var i = 5000 - 1; i >= 0; i--) {
        	var rX = Math.random()* 10 - 5;
        	var rY = Math.random()* 10 - 5;
        	var rZ = Math.random()* 10 - 5;

        	// Box
			var meshData = ShapeCreator.createBox(0.05, 0.05, 0.05);
			var boxEntity = EntityUtils.createTypicalEntity(goo.world, meshData);
			var material = Material.createMaterial(ShaderLib.texturedLit, 'BoxMaterial');
			boxEntity.meshRendererComponent.materials.push(material);
				// Box script
			boxEntity.setComponent(new ScriptComponent({
			    run: function (entity) {
			        entity.transformComponent.transform.setRotationXYZ(
			            World.time * i * 1.2,
			            World.time * i * 2.0,
			            0
			        );
			        entity.transformComponent.setUpdated();
			    }
			}));
			boxEntity.transformComponent.transform.translation.set(rX,rY,rZ);
			boxEntity.addToWorld();
        };

		// // Box
		// var meshData = ShapeCreator.createBox(1, 1, 1);
		// var boxEntity = EntityUtils.createTypicalEntity(goo.world, meshData);
		// var material = Material.createMaterial(ShaderLib.texturedLit, 'BoxMaterial');
		// boxEntity.meshRendererComponent.materials.push(material);
		// 	// Box script
		// boxEntity.setComponent(new ScriptComponent({
		//     run: function (entity) {
		//         entity.transformComponent.transform.setRotationXYZ(
		//             World.time * 1.2,
		//             World.time * 2.0,
		//             0
		//         );
		//         entity.transformComponent.setUpdated();
		//     }
		// }));
		// boxEntity.addToWorld();

    });
});