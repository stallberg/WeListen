
var io = require('socket.io')(3000);

// Imports the Google Cloud client library
const speech = require('@google-cloud/speech').v1p1beta1;
// Creates a client
const speechClient = new speech.SpeechClient();

const encoding = 'LINEAR16';
const sampleRateHertz = 16000;
const languageCode = 'en-US';

const speechCommands = [
    'clear',
    'next',
    'previous',
    'review',
    'save',
    'close',
    'submit',
    'desktop',
    'mobile',
    'tablet',
    'high',
    'medium',
    'low',
    'crash',
    'error code',
]

const request = {
    config: {
      encoding: encoding,
      sampleRateHertz: sampleRateHertz,
      languageCode: languageCode,
      enableAutomaticPunctuation: true,
      speechContexts: [{
          phrases: speechCommands
      }]
    },
    interimResults: true,
  };



  io.on('connection', function (client) {
    console.log('Client Connected to server');
    let recognizeStream = null;

    client.on('start_stream', function (data) {
        startRecognitionStream(this, data);
    });

    client.on('restart_stream', function (data) {
        console.log("restarted");
        restartRecognitionStream(this);
    });

    client.on('end_stream', function (data) {
        stopRecognitionStream();
    });

    client.on('audio_stream', function (data) {
        //console.log(data);
        if (recognizeStream !== null) {
            recognizeStream.write(data);
        }
    });

    function startRecognitionStream(client, data) {
        recognizeStream = speechClient.streamingRecognize(request)
            .on('error', (error) => {
                if(error.message === 'Exceeded maximum allowed stream duration of 65 seconds.'){
                    console.log("Exceeded stream duration of 65 seconds -> restarting stream");
                    restartRecognitionStream(client);
                }
                else {
                    console.log(error);
                }
            })
            
            .on('data', (data) => {
                process.stdout.write(
                    (data.results[0] && data.results[0].alternatives[0])
                        ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
                        : `\n\nReached transcription time limit, please restart\n`);
                client.emit('transcription', data);
            });
    }

    function stopRecognitionStream() {
        if (recognizeStream) {
            recognizeStream.end();
        }
        recognizeStream = null;
    }

    function restartRecognitionStream(client){
        stopRecognitionStream();
        startRecognitionStream(client, '');
    }

});

