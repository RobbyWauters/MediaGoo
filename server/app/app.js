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
var utils = require('./utils');
var socketio = require('socket.io');
var pngparse = require("pngparse");
var image = require('./image');

var ROOTDIR = path.join(__dirname, config.mosaic.folders.root);

var app = express();

/*
 *
 */
var lastCommittedImage = [];

app.configure(function(){
	app.set('port', process.env.PORT || 3003);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
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
	res.render('visualizer', { title: 'MediaGoo', startImage:lastCommittedImage });
});

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

		res.send(200);
		resizeImage(name);
	});
});

function resizeImage(imgName){
	var uploadedFile = path.join(ROOTDIR, config.mosaic.folders.full, imgName);
	var targetFile = path.join(ROOTDIR, config.mosaic.folders.resizes, imgName) + '.png';

	image.crop(uploadedFile, 200, 200, targetFile, function (err, imgres) {
		if(err) return console.log(err);

		pngparse.parseFile(targetFile, function (err, data) {
			if(err) return console.log(err);

		    console.log(data);
		    lastCommittedImage = data.data;
		    io.sockets.emit( 'new', data.data );
		})
	});
}

io.sockets.on('connection', function (socket) {
	socket.emit( 'new', lastCommittedImage);
});

function loadStartImage(){
	var startFile = path.join(ROOTDIR, config.mosaic.folders.startImage);
	pngparse.parseFile(startFile, function (err, data) {
		if(err) return console.log(err);

		console.log(data);
		lastCommittedImage = data.data;
		// io.sockets.emit( 'new', data.data );
	})
}

loadStartImage();




