let recordBtn = document.getElementById("recordButton")
let transcriptionOutput = document.getElementById("transcription")

//Alternate between start and stop recording for same recordButton
let startStopRecording = (function(){
    let start = true;
    return function() {
        start ? startRecording() : stopRecording();
        start = !start;
    }
})();

recordButton.addEventListener("click", startStopRecording);

var stream;

function startRecording() {
    recordButton.innerHTML = "Stop Recording";
    document.querySelector('#transcription').innerHTML = "";

fetch('/api/speech-to-text/token')
.then(function(response) {
    return response.text();
    
}).then(function (token) {
 

stream = WatsonSpeech.SpeechToText.recognizeMicrophone({
    token: token,
    outputElement: '#transcription' // CSS selector or DOM Element
});

stream.on('error', function(err) {
    console.log(err);
});

}).catch(function(error) {
    console.log(error);
});
}



function stopRecording(){
    recordButton.innerHTML = "Record";
    stream.stop();
};
