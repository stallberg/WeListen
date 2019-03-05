// This file contains all the necessary functions
// for controlling the audio when doing text-to-speech

let audio = document.createElement('audio')

function playTTS() {
    if(ttsEnabled){
        let url = questions[ind].audioUrl
        audio.pause()
        audio.setAttribute('src', url)
        audio.play();   
    }   
}

function stopTTS() {
    audio.pause()
    audio.currentTime = 0;
}