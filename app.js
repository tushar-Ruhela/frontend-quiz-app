const togglebtn = document.getElementsByClassName("toggle-btn")[0];
let bodyImage = document.getElementsByTagName("body")[0];
let sunLight = document.getElementsByClassName("sunlight")[0];
let moonlight = document.getElementsByClassName("dark-light")[0];
let subjects = document.getElementsByClassName("subject");
let subjectsArray = Array.from(subjects);
let options = document.querySelectorAll(".option-btn");
const section1 = document.getElementById("section1");
var bars = document.querySelectorAll(".current-subject");

let isClicked = false;

togglebtn.addEventListener("click", function () {
  if (isClicked) {
    bodyImage.style.backgroundImage =
      "url('assets/images/pattern-background-mobile-light.svg')";
    bodyImage.style.color = "#313E51";
    bodyImage.style.backgroundColor = "white";
    sunLight.style.backgroundImage = "url('assets/images/icon-sun-dark.svg')";
    moonlight.style.backgroundImage = "url('assets/images/icon-moon-dark.svg')";
    togglebtn.style.transform = "translateX(0)";
    for (var i = 0; i <subjects.length; i++) {
      subjects[i].style.backgroundColor="rgb(217, 241, 247)";
}
for (var i = 0; i <options.length; i++) {
  options[i].style.backgroundColor="rgb(218, 231, 231)";
}

    isClicked = false;
  } else {
    bodyImage.style.backgroundImage =
      "url('assets/images/pattern-background-mobile-dark.svg')";
    bodyImage.style.color = "white";
    bodyImage.style.backgroundColor = "#313E51";
    sunLight.style.backgroundImage = "url('assets/images/icon-sun-light.svg')";
    moonlight.style.backgroundImage =
      "url('assets/images/icon-moon-light.svg')";
    togglebtn.style.transform = "translateX(20px)";

    for (var i = 0; i <subjects.length; i++) {
          subjects[i].style.backgroundColor=" #3B4D66"
    }
    for (var i = 0; i <options.length; i++) {
      options[i].style.backgroundColor=" #3B4D66";
    }
    
    isClicked = true;
  }
});

var quizType;

subjectsArray.forEach((sub)=>{
  sub.addEventListener("click",(e)=>{
   quizType=sub.getAttribute("id");
      questionScreen(quizType);
      // console.log(quizType)
  })
})


function questionScreen(type) {
  // console.log(type)
  section1.style.display = 'none';
  document.querySelector(".quiz-front-page").classList.toggle("display");
  setSubBars(type);
  document.querySelector(".questions-section").classList.toggle("display");
  loadQuizData(type);
}
function setSubBars(type) {
 
  
  // console.log(type)
  for (let bar of bars) {
   bar.lastElementChild.innerHTML=type;
    if (type == "HTML") {
        
      bar.firstElementChild.firstElementChild.src =
        "./assets/images/icon-html.svg";
    } else if (type == "CSS") {
      bar.firstElementChild.firstElementChild.src =
        "./assets/images/icon-css.svg";
    } else if (type == "JavaScript") {
      bar.firstElementChild.firstElementChild.src =
        "./assets/images/icon-js.svg";
    } else {
      bar.firstElementChild.firstElementChild.src =
        "./assets/images/icon-accessibility.svg";
    }
    bar.style.visibility = "visible";
  }
}

var quizChosen;
var qCount = -1;
var totalQuestions;
var score = 0;
var submit = document.getElementById('submit');
var increment;

async function loadQuizData(type) {
  try {
    const response = await fetch("./data.json");
    const jsonData = await response.json();
    quizChosen = jsonData.quizzes.find(quiz => quiz.title === type);

    if (quizChosen) {
      totalQuestions = quizChosen.questions.length;
      document.querySelector(".total-question").textContent = totalQuestions;
      increment = (1 / totalQuestions) * 100;
      makeQuestions();
    } else {
      console.error("No quiz found for type:", type);
    }
  } catch (error) {
    console.error("Error loading quiz data:", error);
  }
}

function makeQuestions() {
  qCount++;
  if (qCount >= totalQuestions) {
    showQuizComplete();
    return;
  }

  // Update question text and options
  document.querySelector(".numof-question").textContent = qCount + 1;
  document.querySelector(".progress").style.width = (increment * (qCount + 1)).toString() + "%";
  submit.textContent = "Submit";
  document.querySelector(".question").textContent = quizChosen.questions[qCount].question;

  options.forEach((option, index) => {
    option.classList.remove("selected", "invalid", "correct");
    console.log(quizChosen.questions[qCount].options[index]);
   
    const optionText = quizChosen.questions[qCount].options[index];

     option.innerHTML = `<div class='options'>${String.fromCharCode(65 + index)}</div>`;
    option.appendChild(document.createTextNode(optionText)); 

   
    // option.innerHTML = `<div class='options'>${String.fromCharCode(65 + index)}</div>${quizChosen.questions[qCount].options[index]}`;
    // console.log(option.innerHTML);

    option.addEventListener("click", function () {
      options.forEach(opt => {
        opt.classList.remove("selected");
        opt.firstElementChild.classList.remove("selected-box");
      });
      this.classList.add("selected");
      this.firstElementChild.classList.add("selected-box");
    });
  });
}

  


submit.addEventListener("click", function () {
  if (submit.textContent == "Next Question") {
    makeQuestions(quizChosen);
    return;
  }
  if (submit.textContent == "See Result") {
    showQuizComplete();
    return;
  }

  if ((selectedBox = document.querySelector(".selected"))) {
    answerText = selectedBox.textContent.slice( 1,selectedBox.textContent.length);
    selectedBox.classList.remove("selected");
    selectedBox.firstChild.classList.remove("selected-box");
    document.querySelector(".select-prompt").style.visibility = "hidden";
  } else {
    document.querySelector(".select-prompt").style.visibility = "visible";
    return;
  }

  if (validate(answerText)) {
    if (!selectedBox.classList.contains("correct")) {
      score++;
      selectedBox.innerHTML += "<img class='correct-icon' src='./assets/images/icon-correct.svg'>";
    
    }
    selectedBox.classList.add("correct");
    selectedBox.firstElementChild.classList.add("correct-box");
  } else {
    if (!selectedBox.classList.contains("invalid")) {
      selectedBox.innerHTML += "<img class='invalid-icon' src='./assets/images/icon-incorrect.svg'>";
    }
    selectedBox.classList.add("invalid");
    selectedBox.firstElementChild.classList.add("invalid-box");
  }

  revealAnswers();


  if (qCount >= totalQuestions - 1) {
    submit.textContent = "See Result";
  } else {
    submit.textContent = "Next Question";
  }
});
console.log(`Score: ${score}, Total Questions: ${totalQuestions}, Quiz Type: ${quizType}`);

function revealAnswers() {
  for (option of options) {
    let text = option.textContent.slice(1, option.textContent.length);

    if (validate(text)) {
      if (!option.classList.contains("correct")) {
        option.classList.add("correct");
        option.firstChild.classList.add("correct-box");
        option.innerHTML +=
          "<img class='correct-icon' src='./assets/images/icon-correct.svg'>";
      }
    } else {
      if (!option.classList.contains("invalid")) {
        option.classList.add("invalid");
        option.firstChild.classList.add("invalid-box");
        option.innerHTML +=
          "<img class='invalid-icon' src='./assets/images/icon-incorrect.svg'>";
      }
    }
  }
}



function validate(selected) {
  let question = quizChosen.questions[qCount];
  return question.answer === selected;
}

const questionSection = document.querySelector(".questions-section");
const scoreSection = document.querySelector(".score-section");


function showQuizComplete() {
  console.log("Showing quiz results...");
  
  if (!questionSection || !scoreSection) {
    console.error("Question or Score section is missing!");
    return;
  }

  questionSection.classList.remove("display");
  scoreSection.classList.add("display");

  const finalScoreElement = document.getElementById("final-score");
  if (finalScoreElement) {
    finalScoreElement.textContent = score;
  } else {
    console.error("Final score element not found!");
  }

  const totalQuestionElement = document.querySelector(".question-total");
  if (totalQuestionElement) {
    totalQuestionElement.textContent = totalQuestions;
  } else {
    console.error("Total question element not found!");
  }

  const subLogo = document.querySelector(".sub-logo");
  if (subLogo) {
    const logo = subLogo.querySelector(".logo");
    if (logo) {
      logo.style.backgroundImage = `url('./assets/images/icon-${quizType.toLowerCase()}.svg')`;
    } else {
      console.error("Logo element not found.");
    }
    const span = subLogo.querySelector("span");
    if (span) {
      span.textContent = quizType;
    } else {
      console.error("Span element not found.");
    }
  } else {
    console.error("Sub logo element not found.");
  }


  const restartBtn = document.getElementsByClassName("restart")[0];
  restartBtn.addEventListener("click", function() {
      
      score = 0;
      qCount = -1;
  
      for (let bar of bars) {
        bar.style.visibility = "hidden";
    }

      scoreSection.classList.remove("display");
      section1.style.display="flex";
  
      document.querySelector(".progress").style.width = "0%"; 
      options.forEach(option => {
          option.classList.remove("selected", "correct", "invalid");
          option.innerHTML = ""; 
      });
  
    
      document.querySelector(".question").textContent = ""; 
  });
  
}
