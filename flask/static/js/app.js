let saveButton = document.getElementById("saveButton");
let previousButton = document.getElementById("previousButton");
let nextButton = document.getElementById("nextButton");
let reviewButton = document.getElementById("reviewButton");
let transcriptionOutput = document.getElementById("transcription");
let questionOutput = document.getElementById("question");
let questionHeader = document.getElementById("questionHeader");



// Function saves answers as sessionstorage items
let updateQuestionHeader = function(){
    let questionNumber = ind+1;
    questionHeader.innerHTML = "<b>Question " + questionNumber + ":</b>";
};

// Function saves answers as sessionstorage items
let saveAnswer = function(){
    if (transcriptionOutput){
        let answer = transcriptionOutput.innerHTML;
        sessionStorage.setItem('answerKey' + ind, answer);
    }
};

// previous function (needs refactoring)
let previousQuestion = function(){
    ind--;
    if (ind !== 0){
        updateQuestionHeader();
        transcriptionOutput.innerHTML = sessionStorage.getItem('answerKey' + ind);
        questionOutput.innerHTML = questions[ind];
        nextButton.disabled = false;
    }
    else{
        updateQuestionHeader();
        transcriptionOutput.innerHTML = sessionStorage.getItem('answerKey' + 0);
        questionOutput.innerHTML = questions[ind];
        previousButton.disabled = true;
    }
};

// next function (needs refactoring)
let nextQuestion = function(){
    ind++;
    if (ind < questions.length){
        updateQuestionHeader();
        transcriptionOutput.innerHTML = sessionStorage.getItem('answerKey' + ind);
        questionOutput.innerHTML = questions[ind];
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
            reviewOutput = reviewOutput + "Question " + (i+1) + "<br>" + questions[i] + "<br>" + "<b>Not answered!</b>" + "<br>";
        }
        else {
            reviewOutput = reviewOutput + "Question " + (i+1) + "<br>" + questions[i] + "<br>" + sessionStorage.getItem('answerKey' + i) + "<br>";
        }
    }

    var w = window.open("");
    w.document.write("<html><head><title>Form Review</title></head><body><b>Vehicle accident claim form:</b></body></html>");
    p = document.createElement("p");
    p.innerHTML = reviewOutput;
    w.document.body.appendChild(p);

    //document.getElementById("demo").innerHTML = reviewOutput;
};

saveButton.addEventListener("click", saveAnswer);
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
transcriptionOutput.innerHTML = sessionStorage.getItem('answerKey' + ind);

// questions for testing UI
let questions = ["What is your name?", "What is your vehicle's make and model?", "What was the place of accident?"];

// First question
questionOutput.innerHTML = questions[ind];

