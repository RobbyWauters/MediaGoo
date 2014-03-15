/*
Demonstrates how to load a scene from config files.

The scene config (simple.scene) contains references to all entities
that should be loaded.
*/

require([
	'goo/loaders/DynamicLoader',
	'goo/entities/GooRunner'
], function (
	DynamicLoader,
	GooRunner
) {
	'use strict';

	function init() {
		// Create typical goo application
		var goo = new GooRunner();
		goo.renderer.domElement.id = 'goo';
		document.body.appendChild(goo.renderer.domElement);

		// The DynamicLoader takes care of loading data from a URL.
		var loader = new DynamicLoader({
			world: goo.world,
			rootPath: './scene/'
		});

		loader.load('simple.scene').then(function(entities) {
			// This function is called when all the entities
			// and their dependencies have been loaded.
			console.log('Success!');
		}).then(null, function(e) {
			// The second parameter of `then` is an error handling function.
			// We just pop up an error message in case the scene fails to load.
			alert('Failed to load scene: ' + e);
		});
	}

	init();
});
