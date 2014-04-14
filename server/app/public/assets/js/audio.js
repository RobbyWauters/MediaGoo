var context;
var audioData = {};
var socket;


window.addEventListener('load', init, false);

function init () {
    window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;


    var analyser;
    var microphone;
    if (navigator.getUserMedia) {
        navigator.getUserMedia({audio: true}, function (stream) {
            context = new AudioContext();
            analyser = context.createAnalyser();
            microphone = context.createMediaStreamSource(stream);
            microphone.connect(analyser);
            // analyser.connect(context.destination); // KAN IN COMMENTAAR, dan hoor je niets
            process();
        });
    };
    function process(){
        setInterval(function(){
            FFTData = new Float32Array(analyser.frequencyBinCount);
            analyser.getFloatFrequencyData(FFTData);
            // console.log(FFTData[0]);

            //store for GOO to use:
            audioData.spectrum = FFTData;
            audioData.guess = guessNote(FFTData);
        },10);
    }
}

function guessNote(spectrum){
    var notes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        primaryNote = 0,
        primaryNoteEnergy = -Infinity,
        total = 0,
        energy,
        freq,
        note;

    for(var i = 19; i < spectrum.length; i++) {
        energy = Math.pow(10, spectrum[i]/10);
        freq = i*context.sampleRate/spectrum.length/2,
            note = Math.round(
                Math.log(freq/440)/Math.log(2)*12)%12;
        notes[note] += energy;
        if(notes[note] > primaryNoteEnergy){
            primaryNote = freq;
            primaryNoteEnergy = notes[note];
        }
        total += energy;
    }
    return {
        totalEnergy: total,
        primaryNoteEnergy: primaryNoteEnergy,
        primaryNote: primaryNote,
        allNotes: notes
    };
}
