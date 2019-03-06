//Socketio connection depending on if local development
// or for cloud deployment
let socket

if(location.port === "8000") {
    socket = io.connect('http://localhost:3000');
}

else {
    socket = io.connect('https://' + document.domain);
}

let transcriptionField = document.getElementById("transcription");
let checkboxCanChange = true;
let isTalking = false;

//For recording audio from user's microphone
navigator.mediaDevices.getUserMedia({audio:true, video: false, noiseSuppression:true})
	.then(handleUserAudio);


function handleUserAudio(stream) {
	socket.emit('start_stream', '')
    let context = new AudioContext();
    let sampleRate = context.sampleRate;
    
    let source = context.createMediaStreamSource(stream);
    let processor = context.createScriptProcessor(4096, 1, 1);

    source.connect(processor);
    processor.connect(context.destination);

    processor.onaudioprocess = function(e){
        
        let audio = e.inputBuffer.getChannelData(0); //left channel

        //Convert to 16000 samplerate, recommended by Google Cloud Speech
		let convertedAudio = downsampleBuffer(audio, sampleRate, 16000);
		socket.emit('audio_stream', convertedAudio);
        
    }
}

//Receives the transcribed audio data from server, returned as object
let currentFinal = "";
socket.on('transcription', function(data){
    let isFinal = data.results[0].isFinal;
    let transcription = data.results[0].alternatives[0].transcript;
    let stability = data.results[0].stability;    

    if(isSpeechCommand(transcription, isFinal) === false){
        console.log("not a command");
        
        processUserInput(transcription, isFinal, stability);


    }

})

function processUserInput(transcription, isFinal, stability) {
    let questionType = questions[ind].answerType;

    if(questionType === 'single') {
        transcription = transcription.replace(/^\s+/g, '').replace(/\.+$/, "");
        questions[ind].stringOptions.forEach(function(option) {
            if(option.description.toLowerCase() === transcription.toLowerCase()){
                
                // custom-radio is the material design bootstrap class for radiobuttons
                $(".custom-radio").each(function(i, container) {
                    $(container).children('input').each(function(j, element) {
                        if(element.value.toLowerCase() === transcription.toLowerCase()){
                            element.checked = true;
                        }
                        
                    })
                })
                
            }
        })
    }


    else if(questionType === 'multi') {
        transcription = transcription.replace(/^\s+/g, '').replace(/\.+$/, "");
        questions[ind].stringOptions.forEach(function(option) {
            if(option.description.toLowerCase() === transcription.toLowerCase() && checkboxCanChange) {

                $(".custom-checkbox").each(function(i, container) {
                    $(container).children('input').each(function(j, element) {
                        if(element.value.toLowerCase() === transcription.toLowerCase()){
                            element.checked = !element.checked;
                            checkboxCanChange = false;
                        }      
                    })
                })
            }
        })
        //Making sure that the checkbox doesn't get checked/unchecked several times due to how real time streaming returns transcriptions
        if(isFinal)checkboxCanChange = true;
    }

    else if(questionType === 'str') {
        if(isFinal) {
            currentFinal += transcription;
            $("#transcription").html(currentFinal);
            $("#transcription").blur();
        }
        else {
            $("#transcription").focus();
            //update output to user if over certain stability threshold
            if(stability >= 0.2){
                document.getElementById("transcription").innerHTML = currentFinal + transcription;
            }    
        }
    }

    else if(questionType == 'int' && isFinal) {
        if(isNumeric(transcription)) {
            answer = parseFloat(transcription)
            $("#transcription").html(answer);
        }
        else {
            console.log(transcription);
            $("#transcription").notify(
                "Please input a numerical value",
                { position:"top center",
                  className: 'warning', 
                }
            );
        }
    }
}

function isSpeechCommand(text, isFinal){
    let command = text.toLowerCase().trim();
    
    switch(command){
        case 'clear':
            if(isFinal){
                clear();
            }
            return true;

        case 'next':
            if(isFinal){
                nextQuestion();
            }
            return true;
        
        case 'previous':
            if(isFinal){
                previousQuestion();
            }
            return true;

        case 'review':
            if(isFinal && isFinalQuestion()){
                reviewForm()
            }
            return true;

        case 'close':
            if(isFinal && isReviewModalVisible()){
                $("#closeButton").trigger('click');
            }
            return true;

        case 'submit':
            if(isFinal && isReviewModalVisible()) {
                $("#submitButton").trigger('click');
            }
            return true;
        
        case 'save':
            if(isFinal && isSaveButtonVisible()) {
                $("#saveButton").trigger('click');
            }
            return true;
        
        case (command.match(/edit question [0-9]/) || {}).input:
            if(isFinal &&  isReviewModalVisible()) {
                temp = command.split(" ")
                index = temp[temp.length-1]
                if (index > questions.length || index < 1){
                    return true
                }
                toQuestion(index-1)
            }
            return true;
            
            
        default:
            return false;
        
    }
    
}

//Keyboard support for some simple navigation
$(document).keydown(function(e){
    switch(e.key) {    
        case 'ArrowLeft':
            if (!isSaveButtonVisible() && !isReviewModalVisible()){
                previousQuestion();
                break;
            }
        case 'ArrowRight':
            if (!isSaveButtonVisible() && !isReviewButtonVisible()){
                nextQuestion();
                break;
            }
            
        case 'ArrowDown':
            socket.emit('restart_stream', '');

        default: return;
    }
});

function clear(){
    if(questions[ind].answerType === 'str' || questions[ind].answerType === 'int'){
        transcriptionField.innerHTML = "";
        currentFinal = "";
    }

    if(questions[ind].answerType === 'multi'){
        $(".custom-checkbox").each(function(i, container) {
            $(container).children('input').each(function(j, element) {
                element.checked = false;   
            });
        });
    }
}

//Used to check if user's answer is a valid numeric value
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

//Auto scrolling behaviour of the transcription textarea field
$("#transcription").change(function() {
    $("#transcription").scrollTop($("#transcription")[0].scrollHeight);
})



//Audio capture helper functions

// 16kHz for GOOGLE CLOUD SPEECH
function downsampleBuffer(buffer, sampleRate, outSampleRate) {
    if (outSampleRate == sampleRate) {
        return buffer;
    }
    if (outSampleRate > sampleRate) {
        throw "Current samplerate smaller than out samplerate";
    }
    var sampleRateRatio = sampleRate / outSampleRate;
    var newLength = Math.round(buffer.length / sampleRateRatio);
    var result = new Int16Array(newLength);
    var offsetResult = 0;
    var offsetBuffer = 0;
    while (offsetResult < result.length) {
        var nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
        var accum = 0, count = 0;
        for (var i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
            accum += buffer[i];
            count++;
        }

        result[offsetResult] = Math.min(1, accum / count)*0x7FFF;
        offsetResult++;
        offsetBuffer = nextOffsetBuffer;
    }
    return result.buffer;
}

function convertFloat32ToInt16(buffer) {
    l = buffer.length;
    buf = new Int16Array(l);
    while (l--) {
      buf[l] = Math.min(1, buffer[l])*0x7FFF;
    }
    return buf.buffer;
  }





