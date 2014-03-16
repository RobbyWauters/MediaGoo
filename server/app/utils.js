var async = require('async');
var fs = require('fs');
var path = require('path');



function removeFileExt (filename) {
	return path.join( path.dirname(filename), path.basename(filename, path.extname(filename)))
}

/**
 * just removes overything from the path up to ... public/ so it can be accessed by the browser
 */
function wwwdfy (path) {
	var match = path.match(/public(\/.+)/);
	if(match && match[1]) return match[1];
	return path;
}

/**
 * Handy function to send errors back to the browser and display them at the same time in the console
 */
function sendError(err, webresponse){
	var o = {
		err: err.toString()
	};
	console.log(err);

	if(err.stack){
		console.log(err.stack);
		o.errstack = err.stack;
	}

	webresponse.json(o);
}


var cleanName = function(name) {
	name = name.toLowerCase();
    name = name.replace(/\s+/gi, '_'); // Replace white space with _
    return name.replace(/[^a-zA-Z0-9\_]/gi, ''); // Strip any special charactere
}


exports.wwwdfy = wwwdfy;
exports.sendError = sendError;
exports.removeFileExt = removeFileExt;
exports.cleanName = cleanName;



