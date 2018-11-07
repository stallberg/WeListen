let microphoneStream;
let recorder;
let input;
 
let AudioContext = window.AudioContext || window.webkitAudioContext;
let audioContext = new AudioContext;
 
let recordButton = document.getElementById("recordButton");
let saveButton = document.getElementById("saveButton");
let previousButton = document.getElementById("previousButton");
let nextButton = document.getElementById("nextButton");
let transcriptionOutput = document.getElementById("transcription");
let questionOutput = document.getElementById("question");

//Alternate between start and stop recording for same recordButton
let startStopRecording = (function(){
    let start = true;
    return function() {
        start ? startRecording() : stopRecording();
        start = !start;
    }
})();

// Function to be implemented
let saveAnswer = function(){
    if (transcriptionOutput){
        let answer = transcriptionOutput.innerHTML;
        sessionStorage.setItem('answerKey' + ind, answer);
    }
};

// Function to be implemented
let previousQuestion = function(){
    ind--;
    if (ind !== 0){
        transcriptionOutput.innerHTML = sessionStorage.getItem('answerKey' + ind);
        questionOutput.innerHTML = questions[ind];
        nextButton.disabled = false;
    }
    else{
        transcriptionOutput.innerHTML = sessionStorage.getItem('answerKey' + 0);
        questionOutput.innerHTML = questions[ind];
        previousButton.disabled = true;
    }
};

// Function to be implemented
let nextQuestion = function(){
    ind++;
    if (ind < questions.length){
        transcriptionOutput.innerHTML = sessionStorage.getItem('answerKey' + ind);
        questionOutput.innerHTML = questions[ind];
        previousButton.disabled = false;
    }
    else{
        //transcriptionOutput.innerHTML = sessionStorage.getItem('answerKey' + ind);
        questionOutput.innerHTML = "You reached the final question";
        nextButton.disabled = true;
    }
};

recordButton.addEventListener("click", startStopRecording);
saveButton.addEventListener("click", saveAnswer);
previousButton.addEventListener("click", previousQuestion);
nextButton.addEventListener("click", nextQuestion);

// initialize buttons as disabled
//saveButton.disabled = true;
previousButton.disabled = true;

//question counter
let ind = 0;

// View stored answer on page load if any
transcriptionOutput.innerHTML = sessionStorage.getItem('answerKey' + ind);

// questions for testing UI
let questions = ["What is your name?", "What is your vehicle's make and model?", "What was the place of accident?"];

// First question
questionOutput.innerHTML = questions[ind];

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
        recorder = new Recorder(input, { numChannels: 1} );
        recorder.record()
 
    }).catch(function(error) {
        recordButton.innerHTML = "Record";
        console.log(error);
    });
}

function stopRecording() {
    //Disable button until response from server
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