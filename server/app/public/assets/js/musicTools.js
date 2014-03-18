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
