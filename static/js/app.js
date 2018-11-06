let microphoneStream;
let recorder;
let input;
 
let AudioContext = window.AudioContext || window.webkitAudioContext;
let audioContext = new AudioContext;
 
let recordButton = document.getElementById("recordButton");
let transcriptionOutput = document.getElementById("transcription");
let nextButton = document.getElementById("nextButton");
let questionOutput = document.getElementById("question");

//Alternate between start and stop recording for same recordButton
let startStopRecording = (function(){
    let start = true;
    return function() {
        start ? startRecording() : stopRecording();
        start = !start;
    }
})();

recordButton.addEventListener("click", startStopRecording);

function startRecording() {
    recordButton.innerHTML = "Stop Recording";
    nextButton.disabled = true;

    //returns a promise
    navigator.mediaDevices.getUserMedia({ audio: true, video: false})
    
    .then(function(stream) {
        //store stream inside another variable to get access to it outside of startRecording()
        microphoneStream = stream;
        input = audioContext.createMediaStreamSource(stream);
 
        /* Create the recorder (Record.js library)
        Google cloud speech requires mono audio */
        recorder = new Recorder(input, { numChannels: 1} );
        recorder.record()
 
    }).catch(function(error) {
        recordButton.innerHTML = "Record";
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

	let filename = "test";
    
    var xhr = new XMLHttpRequest();
    xhr.onload = function(event) {
        if(xhr.readyState === 4){
            //display response on screen
            transcriptionOutput.innerHTML = event.target.responseText;
            nextButton.disabled = false;
        }
        else {
            console.log("Error");
            transcriptionOutput.innerHTML = "error";  
        }
        recordButton.disabled = false;
        recordButton.innerHTML = "Record";
    };

    let formdata = new FormData();
    formdata.append("audio_data",blob, filename);
    xhr.open("POST", window.location.href + "recognize", true);
    //xhr.open("POST","https://welisten.macister.fi/recognize",true);
    formdata.append("audio_data", blob, filename);
    xhr.send(formdata);
}

// Function to be implemented
let nextQuestion = function(){
    ind++;
    if (ind < questions.length){
        questionOutput.innerHTML = questions[ind];
        nextButton.disabled = true;
    }
    else{
        questionOutput.innerHTML = "You've reached the final question";
    }
};

nextButton.addEventListener("click", nextQuestion);

// initialize button as disabled
nextButton.disabled = true;

//question counter
var ind = 0;

// questions
var questions = ["This is question 1", "This is question 2", "This is question 3"];

// First question
questionOutput.innerHTML = questions[ind];