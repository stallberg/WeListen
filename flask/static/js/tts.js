// This file contains all the necessary functions
// for controlling the audio when doing text-to-speech

let audio = document.createElement('audio')

function playTTS() {      
    let url = questions[ind].audio
    audio.pause()
    audio.setAttribute('src', url)
    audio.play();   
}

function stopTTS() {
    audio.pause()
}