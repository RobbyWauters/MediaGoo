$(function(){

	var upload = new Upload();
	var socket;
	upload.init();
	initSocket();
	if(screen.height < $('body').height())
		$('body').height(screen.height);

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

	function newContent(data){
		console.log(data);
	}

	function urlParam(name){
	    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
	    if (results==null){
	       return null;
	    }
	    else{
	       return results[1] || 0;
	    }
	}
});
