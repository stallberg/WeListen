let clearButton = document.getElementById("clearButton");
let previousButton = document.getElementById("previousButton");
let nextButton = document.getElementById("nextButton");
let reviewButton = document.getElementById("reviewButton");
let saveButton = document.getElementById("saveButton");
let submitButton = document.getElementById("submitButton");
let transcriptionOutput = document.getElementById("transcription");
let questionOutput = document.getElementById("question");
let messageOutput = document.getElementById("messageOutput");
let multipleChoiceContainer = document.getElementById("multiple-choice-container");
let normalAnswerContainer = document.getElementById("normal-answer-container");
let multipleChoiceOptions = document.getElementById("multiple-choice-options");

//boolean for controlling text-to-speech functionality
let ttsEnabled = true;


let updateProgressBar = function() {
    let percentage = ((ind+1) / questions.length)*100
    $(".progress-bar").css("width", `${percentage}%`);
    $(".progress-bar").html(`${ind+1}/${questions.length}`);
};

let saveAnswer = function(){
    if(questions[ind].answerType === 'single') {
        $(".custom-radio").each(function(i, container) {
            $(container).children('input').each(function(j, element) {
                if(element.checked) {
                    questions[ind].answer = element.value;
                }  
            })  
        })  
    }

    //store checkbox answers in array?
    if(questions[ind].answerType === 'multi') {
        let answers = []
        $(".custom-checkbox").each(function(i, container) {
            $(container).children('input').each(function(j, element) {
                if(element.checked) {
                    answers.push(element.value)
                }  
            })  
        })  
        questions[ind].answer = answers;
    }

    else if(questions[ind].answerType === 'str' || questions[ind].answerType === 'int') {
        questions[ind].answer = transcriptionOutput.innerHTML;
        clear();
    }

};

// previous function (needs refactoring)
var previousQuestion = function(){
    socket.emit('restart_stream', '');
    if(ind === 0) return; // prevent voice commands from going out of bounds
    saveAnswer();
    ind--;
    updateProgressBar();
    renderQuestion(questions[ind]);

    if (ind !== 0){
        nextButton.disabled = false;
        reviewButton.style.display = "none";
        nextButton.style.display = "inline-block";
        messageOutput.innerHTML = "";
    }
    else{
        previousButton.disabled = true;
    }

    //Text to speech
    setTimeout(function(){ playTTS() }, 400);
};

// next function (needs refactoring)
var nextQuestion = function(){
    socket.emit('restart_stream', '');
    if(ind === questions.length-1) return; // prevent voice commands from going out of bounds
    saveAnswer();
    ind++;
    updateProgressBar();
    renderQuestion(questions[ind])

    if (ind < questions.length-1){
        //questionOutput.innerHTML = questions[ind].question;
        previousButton.disabled = false;
    }

    //final question
    else{
        messageOutput.innerHTML = "<h5>You reached the final question.</h5>";
        nextButton.disabled = true;
        reviewButton.style.display = "inline-block";
        nextButton.style.display = "none";
    }

    //Text to speech
    setTimeout(function(){ playTTS() }, 400);
};

// to a specific question after review
var toQuestion = function(index){
    ind = index
    $('#reviewModal').modal('toggle');
    socket.emit('restart_stream', '');
    //if(ind === questions.length-1) return; // prevent voice commands from going out of bounds   
    updateProgressBar();
    console.log(questions[ind].answer)
    renderQuestion(questions[ind])
    messageOutput.innerHTML = "";

    previousButton.disabled = true;
    nextButton.disabled = true;
    reviewButton.disabled = true;
    saveButton.style.display = "inline-block";
    reviewButton.style.display = "none";
    nextButton.style.display = "none"; 
    previousButton.style.display = "none";

    //Text to speech
    setTimeout(function(){ playTTS() }, 400);
};

// review form
function reviewForm() {
    stopTTS()   // stop playing the text-to-speech
    saveAnswer() //Save last answer
    let reviewOutput = "";
    let questionButton = "";

    for(let i = 0; i < questions.length; i++) {
        reviewOutput+= `<h5>${i+1}. ${questions[i].question}<button onclick="toQuestion(${i})"class="edit-button"> <i class="fa fa-pencil"></i></button></h5>`
        if(questions[i].answer.length === 0) {
            reviewOutput+= `<p>Question not answered.</p><br>`;   
        }
        else {
            reviewOutput+= `<p>${questions[i].answer}</p><br>`;
        } 
    }

    $("#form-review-body").empty();
    $("#form-review-body").append(reviewOutput);

    $('#reviewModal').modal('toggle')


};

//save after editing
function saveEdit(){
    socket.emit('restart_stream', '');
    //if(ind === questions.length-1) return; // prevent voice commands from going out of bounds
    saveAnswer();
    ind = questions.length-1;
    updateProgressBar();
    renderQuestion(questions[ind])

    saveButton.style.display = "none";
    previousButton.style.display = "inline-block";
    previousButton.disabled = false;
    messageOutput.innerHTML = "<h5>You reached the final question.</h5>";
    nextButton.disabled = true;
    nextButton.style.display = "none";
    reviewButton.style.display = "inline-block";
    reviewButton.disabled = false;
    reviewForm()
}

//savePDF()
function savePDF(){
    let i;
    let reviewOutput = 'Test Form\n';
    for (i = 0; i < questions.length; i++) {
        reviewOutput = reviewOutput + "\n" + "\n" + (i+1) + ". " + questions[i].question + "\n" + questions[i].answer + "\n";
    }

    // Default export is a4 paper, portrait, using milimeters for units
    var doc = new jsPDF()

    //doc.text('Vehicle accident claim form:', 10, 10)
    doc.text(reviewOutput, 10, 10);
    doc.save('test.pdf');
};

//vc toggle
function toggleVoiceCommandsHandler(){
    $("#toggleVoiceCommands").toggleClass("muted");
}


//Text-to-speech toggle handler
function toggleTextToSpeechHandler(){
    ttsEnabled = !ttsEnabled;
    if(!ttsEnabled) {
        stopTTS();
    }
    else {
        playTTS();
    }
    
    $("#toggleTextToSpeech").toggleClass("muted");
}

//Auto closes the modal on successful submit after 1,5s
function submitFormButtonHandler() {
    setTimeout(function() {
        $("#formSubmittedModal").modal('hide')
        
        //Redirect to the form index page
        document.location.href="/";
        
        // ind = 0;
        // updateProgressBar();

        // // Show first question and empty answers
        // questions = resetAllAnswers(questions);

        // renderQuestion(questions[ind]);
        // messageOutput.innerHTML = "";
        // nextButton.disabled = false;
        // reviewButton.style.display = "none";
        // nextButton.style.display = "inline-block";
        // previousButton.disabled = true;

    }, 1500);
}

clearButton.addEventListener("click", clear);
previousButton.addEventListener("click", previousQuestion);
nextButton.addEventListener("click", nextQuestion);
reviewButton.addEventListener("click", reviewForm);
saveButton.addEventListener("click", saveEdit);

$("#closeButton").click(function() {
    $('#reviewModal').modal('toggle');
})

$("#submitButton").click(function() {
    submitFormButtonHandler();
})

$("#toggleVoiceCommands").click(function() {
    toggleVoiceCommandsHandler();
})

$("#toggleTextToSpeech").click(function() {
    toggleTextToSpeechHandler();
})

// initialize buttons as disabled
//saveButton.disabled = true;
previousButton.disabled = true;


function renderQuestion(question) {
    //Set the question being displayed to the user
    questionOutput.innerHTML = question.question;


    //For multiple choice, hide the normal user input area
    if(question.answerType === 'single') {
        multipleChoiceContainer.style.display = "block";
        normalAnswerContainer.style.display = "none";
        renderMultipleChoiceQuestions(question);


    }

    else if(question.answerType === 'multi') {
        multipleChoiceContainer.style.display = "block";
        normalAnswerContainer.style.display = "none";
        renderCheckboxQuestions(question);
    }

    //Normal question
    else if(question.answerType === 'str' || question.answerType === 'int') {
        multipleChoiceContainer.style.display = "none";
        normalAnswerContainer.style.display = "block";
        $("#transcription").html(question.answer);
    }

}

function renderMultipleChoiceQuestions({stringOptions}) {
    clearMultipleChoiceContainer();
    stringOptions.forEach(function(option, index) {

        $("#multiple-choice-container")
            .append( `<div class="custom-control custom-radio">
                        <input id=${index} type="radio" class="custom-control-input" name="radio" value=${option.description} />
                        <label for=${index} class="custom-control-label">${option.description}</label>
                    </div>`
        );
    })

    // set answer as checked, if question has been answered before
    $(".custom-radio").each(function(i, container) {
        $(container).children('input').each(function(j, element) {
            if(element.value === questions[ind].answer){
                element.checked = true;
            }
            
        })
    })
}


function renderCheckboxQuestions({stringOptions}) {
    clearMultipleChoiceContainer();
    stringOptions.forEach(function(option, index) {

        $("#multiple-choice-container")
            .append( `<div class="custom-control custom-checkbox">
                        <input id=${index} type="checkbox" class="custom-control-input" name="checkbox" value=${option.description} />
                        <label for=${index} class="custom-control-label">${option.description}</label>
                    </div>`
        );
    })

    // set answer as checked, if question has been answered before
    $(".custom-checkbox").each(function(i, container) {
        $(container).children('input').each(function(j, element) {
            questions[ind].answer.forEach(function(answer) {                
                if(answer === element.value){
                    element.checked = true
                }
            })   
        })
    }) 
}

//Empties all child elements under the container, used for both radio and checkbox
function clearMultipleChoiceContainer() {
    $("#multiple-choice-container").empty()
}

function resetAllAnswers(questions) {

    for(let i = 0; i < questions.length; i++) {
        if (questions[i].answerType === 'multi') {
            questions[i].answer = []
        }
        else {
            questions[i].answer = ''
        }
    }
    return questions
}

function isFirstQuestion() {
    return (ind === 0)
}

function isFinalQuestion() {
    return (ind === questions.length - 1)
}

function isReviewModalVisible() {
    return ($('#reviewModal').is(':visible'))
}

function isSaveButtonVisible() {
    return ($('#saveButton').is(':visible'))
}

function isReviewButtonVisible() {
    return ($('#reviewButton').is(':visible'))
}


//Question form for demo
var form

//array of all questions
var questions

//current question index
let ind = 0;


// TODO: FIX PROPERLY
/* TESTING FORM FETCH */ 
 fetch('./json/')
    .then(function(response) {
        return response.json()
    })
    .then(function(json){
        form = json
        questions = form.questions

        questions = resetAllAnswers(questions)

        //initialize progressbar
        updateProgressBar()

        // Show first question
        renderQuestion(questions[ind]);

        // Play tts for first question, small timeout so it doesn't start immediately
        setTimeout( function() {
            playTTS() 
        }, 500);
        
    })

