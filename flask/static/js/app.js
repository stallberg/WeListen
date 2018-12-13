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


let updateProgressBar = function(index) {
    let percentage = ((index+1) / questions.length)*100
    $(".progress-bar").css("width", `${percentage}%`);
    $(".progress-bar").html(`${index+1}/${questions.length}`);
};

let saveAnswer = function(){

    if(questions[ind].answerType === 'multi') {
        $(".custom-radio").each(function(i, container) {
            $(container).children('input').each(function(j, element) {
                if(element.checked) {
                    questions[ind].answer = element.value;
                }  
            })  
        })  
    }

    //store checkbox answers in array?
    if(questions[ind].answerType === 'checkbox') {
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

    else if(questions[ind].answerType === 'str'){
        questions[ind].answer = transcriptionOutput.innerHTML;
        clear();
    }

};

// previous function (needs refactoring)
var previousQuestion = function(){
    if(ind === 0) return; // prevent voice commands from going out of bounds
    saveAnswer();
    ind--;
    updateProgressBar(ind);
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
};

// next function (needs refactoring)
var nextQuestion = function(){
    if(ind === questions.length-1) return; // prevent voice commands from going out of bounds
    saveAnswer();
    ind++;
    updateProgressBar(ind);
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
};

// review form
function reviewForm() {
    saveAnswer() //Save last answer
    let reviewOutput = "";

    for(let i = 0; i < questions.length; i++) {
        if(questions[i].answer.length === 0) {
            reviewOutput+= `<h5>${questions[i].question}</h5><p>Question not answered.</p><br>`;   
        }
        else {
            reviewOutput+= `<h5>${questions[i].question}</h5><p>${questions[i].answer}</p><br>`;
        }
    }

    $("#form-review-body").empty();
    $("#form-review-body").append(reviewOutput);


};

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

//Auto closes the modal on successful submit after 1,5s
function submitFormButtonHandler() {
    setTimeout(function() {
        $("#formSubmittedModal").modal('hide')
    }, 1500);
}

clearButton.addEventListener("click", clear);
previousButton.addEventListener("click", previousQuestion);
nextButton.addEventListener("click", nextQuestion);
reviewButton.addEventListener("click", reviewForm);
saveButton.addEventListener("click", savePDF);


$("#submitButton").click(function() {
    submitFormButtonHandler();
})


$(document).keydown(function(e){
    console.log(e.key);
    switch(e.key) {
        
        case 'ArrowLeft':
            previousQuestion();
            break;
        case 'ArrowRight':
            nextQuestion();
            break;

        default: return;
    }

});

// initialize buttons as disabled
//saveButton.disabled = true;
previousButton.disabled = true;


function renderQuestion(question) {
    //Set the question being displayed to the user
    questionOutput.innerHTML = question.question;


    //For multiple choice, hide the normal user input area
    if(question.answerType === 'multi') {
        multipleChoiceContainer.style.display = "block";
        normalAnswerContainer.style.display = "none";
        renderMultipleChoiceQuestions(question);


    }

    else if(question.answerType === 'checkbox') {
        multipleChoiceContainer.style.display = "block";
        normalAnswerContainer.style.display = "none";
        renderCheckboxQuestions(question);
    }

    //Normal question
    else if(question.answerType === 'str') {
        multipleChoiceContainer.style.display = "none";
        normalAnswerContainer.style.display = "block";
        $("#transcription").html(question.answer);
    }

}

function renderMultipleChoiceQuestions({options}) {
    clearMultipleChoiceContainer();
    options.forEach(function(option, index) {

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


function renderCheckboxQuestions({options}) {
    clearMultipleChoiceContainer();
    options.forEach(function(option, index) {

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

/*
//Test form for building UI
var form = {
    name: 'Test form',
    questions: [
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
        {
            question: "Checkbox question",
            answerType : 'checkbox',
            options: [
                {description: 'Hello'},
                {description: 'Goodbye'},
                {description: 'Test'},
            ],
            answer: [],
        }
    ]
}
*/

//Question form for demo
var form = {
    name: 'Defect Report Form',
    questions: [
        {
            question: "Please specify the title of the error",
            answerType : 'str',
            answer: '',
        },

        {
            question: "Which platform(s) are you using?",
            answerType : 'checkbox',
            options: [
                {description: 'Desktop'},
                {description: 'Mobile'},
                {description: 'Tablet'},
            ],
            answer: [],
        },

        {
            question: "Please describe the error details",
            answerType : 'str',
            answer: '',
        },

        {
            question: "What is the severity of the error?",
            answerType: 'multi',
            options: [
                {
                    description: 'High'
                },
                {
                    description: 'Medium'
                },
                {
                    description: 'Low'
                }
            ],
            answer: '',
        }
    ]
}

//array of all questions
var questions = form.questions;

//question counter
let ind = 0;

//initialize progressbar on page load
updateProgressBar(0);

// Show first question
renderQuestion(questions[ind]);
