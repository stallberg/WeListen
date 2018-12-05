let clearButton = document.getElementById("clearButton");
let previousButton = document.getElementById("previousButton");
let nextButton = document.getElementById("nextButton");
let reviewButton = document.getElementById("reviewButton");
let saveButton = document.getElementById("saveButton");
let closeButton = document.getElementById("closeButton");
let transcriptionOutput = document.getElementById("transcription");
let questionOutput = document.getElementById("question");
let messageOutput = document.getElementById("messageOutput");
//let questionHeader = document.getElementById("questionHeader");
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
        clearTranscriptionField();
    }

};

// previous function (needs refactoring)
var previousQuestion = function(){
    saveAnswer();
    ind--;
    updateProgressBar(ind);
    renderQuestion(questions[ind]);

    if (ind !== 0){
        nextButton.disabled = false;
        reviewButton.style.visibility = "hidden";
        messageOutput.innerHTML = "";
    }
    else{
        previousButton.disabled = true;
    }
};

// next function (needs refactoring)
var nextQuestion = function(){
    saveAnswer();
    ind++;
    updateProgressBar(ind);
    renderQuestion(questions[ind])

    if (ind < questions.length-1){
        //questionOutput.innerHTML = questions[ind].question;
        previousButton.disabled = false;
    }
    else{
        messageOutput.innerHTML = "<b>You reached the final question.</b>";
        nextButton.disabled = true;
        reviewButton.style.visibility = "visible";
    }
};

// review form
let reviewForm = function(){
    saveAnswer() //Save last answer
    let i;
    let reviewOutput = "";
    for (i = 0; i < questions.length; i++) {
        reviewOutput = reviewOutput + "<b>Question " + (i+1) + "</b><br>" + questions[i].question + "<br>" + questions[i].answer + "<br>";
    }

    document.getElementById("overlay").style.display = "block";
    document.getElementById("text").innerHTML = reviewOutput;

    //pop-up window commented out
    /*
    var w = window.open("");
    w.document.write("<html><head><title>Form Review</title></head><body><b>Vehicle accident claim form:</b></body></html>");
    p = document.createElement("p");
    p.innerHTML = reviewOutput;
    w.document.body.appendChild(p);
    //document.getElementById("demo").innerHTML = reviewOutput;
    */
};

function closeOverlay() {
    document.getElementById("overlay").style.display = "none";
}

//savePDF()
let savePDF = function(){
    let i;
    let reviewOutput = '';
    for (i = 0; i < questions.length; i++) {
        reviewOutput = reviewOutput + "\n" + "\n" + "Question " + (i+1) + "\n" + questions[i].question + "\n" + questions[i].answer + "\n";
    }

    // Default export is a4 paper, portrait, using milimeters for units
    var doc = new jsPDF()

    //doc.text('Vehicle accident claim form:', 10, 10)
    doc.text(reviewOutput, 10, 10);
    doc.save('test.pdf');
};

clearButton.addEventListener("click", clearTranscriptionField);
previousButton.addEventListener("click", previousQuestion);
nextButton.addEventListener("click", nextQuestion);
reviewButton.addEventListener("click", reviewForm);
saveButton.addEventListener("click", savePDF);
closeButton.addEventListener("click", closeOverlay);

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

//array of all questions
var questions = form.questions;

//question counter
let ind = 0;

//initialize progressbar on page load
updateProgressBar(0);

// Show first question
renderQuestion(questions[ind]);
