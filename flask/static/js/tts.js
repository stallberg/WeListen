let audio = document.createElement('audio')

// // Initializing values
// var onplaying = true;
// var onpause = false;

// // On video playing toggle values
// audio.onplaying = function() {
//     onplaying = true;
//     onpause = false;
// };

// // On video pause toggle values
// audio.onpause = function() {
//     onplaying = false;
//     onpause = true;
// };

// Play video function
// function playTTS() {      
//     if (audio.paused && !onplaying) {
//         let url = questions[ind].audio
//         audio.setAttribute('src', url)
//         audio.play();
//     }
// } 

// // Pause video function
// function pauseTTS() {     
//     if (!audio.paused && !onpause) {
//         audio.pause();
//     }
// }




function playTTS() {      
    let url = questions[ind].audio
    audio.pause()
    audio.setAttribute('src', url)
    audio.play();
    
} 