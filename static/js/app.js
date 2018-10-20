var microphoneStream;
var recorder;
var input;
 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext;
 
var recordButton = document.getElementById("recordButton");
var transcriptionOutput = document.getElementById("transcription")

//Alternate between start and stop recording for same recordButton
var startStopRecording = (function(){
    var start = true;
    return function() {
        start ? startRecording() : stopRecording();
        start = !start;
    }
})();

recordButton.addEventListener("click", startStopRecording);


function startRecording() {

    recordButton.innerHTML = "Stop Recording";

    //returns a promise
    navigator.mediaDevices.getUserMedia({ audio: true, video: false})
    
    .then(function(stream) {
        //store stream inside another variable to get access to it outside of startRecording()
        microphoneStream = stream;
        input = audioContext.createMediaStreamSource(stream);
 
        /* Create the recorder (Record.js library)
        Google cloud speech requires mono audio */
        recorder = new Recorder(input, { numChannels: 1} )
        recorder.record()
 
    }).catch(function(error) {
        recordButton.innerHTML = "Record"
        console.log(error);
    });
}


function stopRecording() {
    //Disable button until response from server
    recordButton.disabled = true;
    recorder.stop();
 
    //stop the microphone stream
    microphoneStream.getAudioTracks()[0].stop();
    
    //create blob and pass to uploadToServer function
    recorder.exportWAV(uploadToServer);
}

function uploadToServer(blob) {

	var filename = "test"
    
    var xhr = new XMLHttpRequest();
    xhr.onload = function(event) {
        if(xhr.readyState === 4){
            //display response on screen
            transcriptionOutput.innerHTML = event.target.responseText;
        }
        else {
            console.log("Error");
            transcriptionOutput.innerHTML = "error";  
        }
        recordButton.disabled = false;
        recordButton.innerHTML = "Record";
    };

    var formdata = new FormData();
    formdata.append("audio_data",blob, filename);
    xhr.open("POST","https://welisten.macister.fi/recognize",true);
    formdata.append("audio_data", blob, filename);
    xhr.send(formdata);
}
