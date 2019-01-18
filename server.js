'use strict';

const express = require('express');
const request = require('request');
const querystring = require('querystring');

const trackRoute = express.Router();

const { Readable } = require('stream');

const multer = require('multer');

const speech = require('./speech');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

const nconf = require('nconf');

nconf.argv().env({lowerCase:true, parseValues:true});

// App
const app = express();

app.use('/tracks', trackRoute);

/**
 * POST /tracks
 */
trackRoute.post('/', (req, res) => {
  const storage = multer.memoryStorage()
  const upload = multer({ storage: storage, limits: { fields: 2, fileSize: 6000000, files: 1, parts: 3 }});
  upload.single('track')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: "Upload Request Validation Failed " + err });
    } else if(!req.body.name) {
      return res.status(400).json({ message: "No track name in request body" });
    }

    let encoding = req.body.encoding;

    let trackName = req.body.name;
    
    console.log("Track: " + trackName);

    const readableTrackStream = new Readable();
    readableTrackStream.push(req.file.buffer);
    readableTrackStream.push(null);

    const recognizeStream = speech.processStream(readableTrackStream, encoding);

    recognizeStream.on('error', () => {
      return res.status(500).json({ message: "Error processing audio stream" });
    });

    recognizeStream.on('data', response => {
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
        console.log(`Transcription: ${transcription}`);
        return res.status(200).json({ message: "File processed successfully", transcript: transcription });
    });

  });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);