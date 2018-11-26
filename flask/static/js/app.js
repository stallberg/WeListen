let clearButton = document.getElementById("clearButton");
let previousButton = document.getElementById("previousButton");
let nextButton = document.getElementById("nextButton");
let reviewButton = document.getElementById("reviewButton");
let transcriptionOutput = document.getElementById("transcription");
let questionOutput = document.getElementById("question");
let questionHeader = document.getElementById("questionHeader");
let multipleChoiceContainer = document.getElementById("multiple-choice-container");
let normalAnswerContainer = document.getElementById("normal-answer-container");
let multipleChoiceOptions = document.getElementById("multiple-choice-options");


let updateQuestionHeader = function(){
    let questionNumber = ind+1;
    questionHeader.innerHTML = "<b>Question " + questionNumber + ":</b>";
};

let saveAnswer = function(){

    if(questions[ind].answerType === 'multi') {
        $("#multiple-choice-container").each(function(i, container) {
            $(container).children('input').each(function(j, element) {
                if(element.checked) {
                    questions[ind].answer = j;
                }  
            })  
        })  
    }

    else if(questions[ind].answerType === 'str'){
        questions[ind].answer = transcriptionOutput.innerHTML;
        clearTranscriptionField();
    }

};

// previous function (needs refactoring)
var previousQuestion = function(){
    saveAnswer();
    ind--;
    updateQuestionHeader();
    renderQuestion(questions[ind]);

    if (ind !== 0){
        nextButton.disabled = false;
    }
    else{
        previousButton.disabled = true;
    }
};

// next function (needs refactoring)
var nextQuestion = function(){
    saveAnswer();
    ind++;
    if (ind < questions.length){
        updateQuestionHeader();
        //transcriptionOutput.innerHTML = sessionStorage.getItem('answerKey' + ind);
        renderQuestion(questions[ind])
        //questionOutput.innerHTML = questions[ind].question;
        previousButton.disabled = false;
    }
    else{
        //transcriptionOutput.innerHTML = sessionStorage.getItem('answerKey' + ind);
        questionHeader.innerHTML = "<b>You reached the final question</b>";
        questionOutput.innerHTML = "Please review the form before submitting";
        nextButton.disabled = true;
        reviewButton.style.visibility = "visible";
    }
};

// review form
let reviewForm = function(){
    let i;
    let reviewOutput = "";
    for (i = 0; i < questions.length; i++) {
        if (sessionStorage.getItem('answerKey' + i) == null) {
            reviewOutput = reviewOutput + "Question " + (i+1) + "<br>" + questions[i].question + "<br>" + "<b>Not answered!</b>" + "<br>";
        }
        else {
            reviewOutput = reviewOutput + "Question " + (i+1) + "<br>" + questions[i].question + "<br>" + sessionStorage.getItem('answerKey' + i) + "<br>";
        }
    }

    var w = window.open("");
    w.document.write("<html><head><title>Form Review</title></head><body><b>Vehicle accident claim form:</b></body></html>");
    p = document.createElement("p");
    p.innerHTML = reviewOutput;
    w.document.body.appendChild(p);

    //document.getElementById("demo").innerHTML = reviewOutput;
};

clearButton.addEventListener("click", clearTranscriptionField);
previousButton.addEventListener("click", previousQuestion);
nextButton.addEventListener("click", nextQuestion);
reviewButton.addEventListener("click", reviewForm);

// initialize buttons as disabled
//saveButton.disabled = true;
previousButton.disabled = true;

//question counter
let ind = 0;

//initialize question header on page load
updateQuestionHeader();

// View stored answer on page load if any
//transcriptionOutput.innerHTML = sessionStorage.getItem('answerKey' + ind);

// questions for testing UI
let form = {
    name: 'Test form',
    questions: [
        {
            question: 'How old are you?',
            answerType : 'str',
            answer: '',
        },
        {
            question: "What is your vehicle's make and model?",
            answerType : 'str',
            answer: '',
        },

        {
            question: "What was the place of accident?",
            answerType : 'str',
            answer: '',
        },
        {
            question: "What is your gender?",
            answerType: 'multi',
            options: [
                {
                    description: 'Male'
                },
                {
                    description: 'Female'
                }
            ],
            answer: '',
        },
    ]
}

function renderQuestion(question) {
    //Set the question being displayed to the user
    questionOutput.innerHTML = question.question;

    //For multiple choice, hide the normal user input area
    if(question.answerType === 'multi') {
        multipleChoiceContainer.style.display = "block";
        normalAnswerContainer.style.display = "none";
        renderMultipleChoiceQuestions(question.options);


    }

    //Normal question
    else if(question.answerType === 'str') {
        multipleChoiceContainer.style.display = "none";
        normalAnswerContainer.style.display = "block";
        transcriptionOutput.innerHTML = question.answer;
    }

}

function renderMultipleChoiceQuestions(options) {
    clearMultipleChoices();
    options.forEach(function(option) {
        $("#multiple-choice-container").append("<input type='radio' name='" + 5 + "' value='" + option.description + "' /> " + option.description +
        " <br />");
    })

    // set answer as checked, if question has been answered before
    $("#multiple-choice-container").each(function(i, container) {
        $(container).children('input').each(function(j, element) {
            if(j === questions[ind].answer){
                element.checked = true;
            }
            
        })
    })


}

function clearMultipleChoices() {
    while (multipleChoiceContainer.firstChild) {
        multipleChoiceContainer.removeChild(multipleChoiceContainer.firstChild);
    }
}

var questions = form.questions;

//let questions = ["What is your name?", "What is your vehicle's make and model?", "What was the place of accident?"];
// First question
renderQuestion(questions[ind]);
