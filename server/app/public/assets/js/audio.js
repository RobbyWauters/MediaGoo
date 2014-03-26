var context;
var audio;
var audioData = {};
var socket;
// var ctx = c.getContext('2d');
// ctx.fillRect(0, 0, c.width, c.height);
// var imageData = ctx.getImageData(0, 0, 1, c.height);


window.addEventListener('load', init, false);
function init() {
    try {
    var AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext
    context = new AudioContext();

    play(songs[0]);

    }
    catch(e) {
        alert('Web Audio API is not supported in this browser');
    }
}

function play(src){
    audio = document.createElement('audio');
    audio.src = src;
    audio.controls = true;
    audio.loop = true;
    document.body.appendChild(audio);
    audio.addEventListener('canplay', function() {
        source = context.createMediaElementSource(audio);
        analyser = context.createAnalyser();
        analyser.smoothingTimeConstant = 0.0;
        spectrum = new Float32Array(analyser.fftSize/8);
        source.connect(analyser);
        analyser.connect(context.destination);
        audio.play();
        setInterval('updateAudioData();', 10);
    });
}

function updateAudioData () {
    // body...
    analyser.getFloatFrequencyData(spectrum);
    audioData.spectrum = spectrum;
    audioData.guess = guessNote(spectrum);
    // GUESS
        // totalEnergy
        // primaryNoteEnergy
        // primaryNote
}



var songs = [
        "/assets/data/cdd.mp3"
];

// function initSocket(){
//     //socket IO:
//     if(!socket){
//         // socket.io initialiseren
//         socket = io.connect(window.location.hostname);
//         // some debugging statements concerning socket.io
//         socket.on('reconnecting', function(seconds){
//             console.log('reconnecting in ' + seconds + ' seconds');
//         });
//         socket.on('reconnect', function(){
//             console.log('reconnected');
//         });
//         socket.on('reconnect_failed', function(){
//             console.log('failed to reconnect');
//         });
//         socket.on('new', newContent);
//     }
// }

// function newContent(data){
//     console.log(data);
// }

