#!/usr/bin/env node

var express = require('express');
var http = require('http')
var path = require('path');
var fs = require('fs');
var async = require('async');
var _ = require('underscore');
var crypto = require('crypto');
var MobileDetect = require('mobile-detect');
var config = require('./config');
var mosaic = require('./mosaic');
var utils = require('./utils');
var twitimage = require('./twitimage');
var im = require('imagemagick');
var socketio = require('socket.io');
var pngparse = require("pngparse")

var ROOTDIR = path.join(__dirname, config.mosaic.folders.root);

var app = express();

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	if(config.showExpressDebugInfo) app.use(express.logger('tiny'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('MediaGoo'));
	app.use(express.session());
	app.use(app.router);
	app.use(require('stylus').middleware(__dirname + '/public'));
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

var server = http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});

// Socket IO
var io = socketio.listen(server);
io.set('log level', 0);


app.get('/', function(req, res){
	res.render('client', { title: 'MediaGoo' });
});

app.get('/viz', function(req, res){
	res.render('visualizer', { title: 'MediaGoo' });
});

// app.get('/', function (req, res){
// 	var md = new MobileDetect(req.headers['user-agent']);
// 	renderView(req, res, true, md.mobile(), false);  // put the first boolean back on 'true' if your really want the fancy bg
// });



function renderView(req, res, fancybg, mobile, forceOldFashionUpload, userid){
	getSomeRandomTilesWithPosition(50, function (err, tiles) {
		if(err) return utils.sendError(err, res);

		res.render('index', {
			title: '| MiX Kerstkaart 2013',
			tiles: tiles,
			card : {
				width: config.mosaic.greetingcard.lowres.width,
				height: config.mosaic.greetingcard.lowres.height,
				mosaicOffsetX: config.mosaic.greetingcard.lowres.offset.x,
				mosaicOffsetY: config.mosaic.greetingcard.lowres.offset.y
			},
			fancybg: fancybg,
			mobile: mobile,
			forceOldFashionUpload: forceOldFashionUpload,
			userid: userid
		});
	});
}



app.post('/xhrupload', function (req, res){
	if(!req.xhr) return utils.sendError(new Error('got no xhr request'), res);

	var size = req.header('x-file-size');
	var type = req.header('x-file-type');
	var name = path.basename(req.header('x-file-name'));


	//name = crypto.createHash('md5').update( ''+(Date.now()) ).digest('hex') + '_' + name;
	name = (Date.now()) + '_' + (utils.removeFileExt(name)).substr(0,6) + path.extname(name) ;
	var uploadedFile = path.join(ROOTDIR, config.mosaic.folders.full, name);

	var ws = fs.createWriteStream( uploadedFile );

	req.on('data', function (data) {
		ws.write(data);
	});

	req.on('end', function () {
		if(config.showDebugInfo) console.log("XHR Upload done");
		ws.end();
		// renderMosaic(null, uploadedFile, req, res);
		res.send(200);
		resizeImage(name);
	});
});

function resizeImage(imgName){
	var uploadedFile = path.join(ROOTDIR, config.mosaic.folders.full, imgName);
	var targetFile = path.join(ROOTDIR, config.mosaic.folders.resizes, imgName);
	//fs.readFile(uploadedFile, function (err, data) {
		// write file to uploads/thumbs folder
		im.convert([uploadedFile, '-resize', '100x100', targetFile+'.png'],
		function(err, stdout){
			if (err) throw err;
			console.log('stdout:', stdout);
			pngparse.parseFile(targetFile+'.png', function(err, data) {
				if(err)
			    	throw err
			    console.log(data);
			    io.sockets.emit( 'new', data.data );
			})
		});

		// im.resize({
		// 	srcPath: uploadedFile,
		// 	dstPath: targetFile,
		// 	width:   100,
		// 	height:  100
		// }, function(err, stdout, stderr){
		// 	if (err) throw err;
		// 	console.log('resized image to fit within 200x200px');
		// 	console.log(stdout);
		// 	// im.resize({
		// 	// 	srcPath: uploadedFile,
		// 	// 	dstPath: targetFile,
		// 	// 	width:   100,
		// 	// 	height:  100
		// 	// }, function(err, stdout, stderr){
		// 	// 	if (err) throw err;

		// 	// });
		// 	fs.readFile(targetFile, function (err, data) {
		// 		console.log(data[0]);
		// 		console.log(data.length);
		// 		//io.sockets.emit( 'reset', id );
		// 		//res.send(200);
		// 	});
		// });
	//}

}




