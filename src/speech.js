// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');
const fs = require('fs');

function SpeechProcessor() {
    console.log("Speech Processor");
}
  

SpeechProcessor.prototype.processStream = function(stream, encoding) {
    console.log("PROCESS STREAM " + encoding);
  
    // Creates a client
    const client = new speech.SpeechClient();

    const request = {
        config: {
            encoding: encoding,
            sampleRateHertz: 16000,
            languageCode: 'en-US',
        },
        interimResults: false, // If you want interim results, set this to true
    };

    // Stream the audio to the Google Cloud Speech API
    const recognizeStream = client
        .streamingRecognize(request);

    // Stream an audio file from disk to the Speech API, e.g. "./resources/audio.raw"
    stream.pipe(recognizeStream);

    return recognizeStream;
}

SpeechProcessor.prototype.process = function(fileName) {
    console.log("PROCESS "+ fileName);

    // Creates a client
    const client = new speech.SpeechClient();

    // Reads a local audio file and converts it to base64
    const file = fs.readFileSync(fileName);
    const audioBytes = file.toString('base64');

    // The audio file's encoding, sample rate in hertz, and BCP-47 language code
    const audio = {
        content: audioBytes,
    };
    const config = {
        encoding: 'FLAC',
        sampleRateHertz: 16000,
        languageCode: 'en-US',
    };
    const request = {
        audio: audio,
        config: config,
    };

    // Detects speech in the audio file
    client
    .recognize(request)
    .then(data => {
        const response = data[0];
        const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
        console.log(`Transcription: ${transcription}`);
    })
    .catch(err => {
        console.error('ERROR:', err);
    });
};

module.exports = new SpeechProcessor();
