// DOM element selections
const toggleBtn = document.querySelector(".toggle-btn");
const body = document.body;
const sunLight = document.querySelector(".sunlight");
const darkLight = document.querySelector(".dark-light");
const subjects = Array.from(document.querySelectorAll(".subject"));
const options = document.querySelectorAll(".option-btn");
const section1 = document.getElementById("section1");
const questionSection = document.querySelector(".questions-section");
const scoreSection = document.querySelector(".score-section");
const submit = document.getElementById('submit');

let isClicked = false;
let quizType;
let quizChosen;
let qCount = -1;
let totalQuestions;
let score = 0;
let increment;

// Theme toggle functionality
toggleBtn.addEventListener("click", function () {
  isClicked = !isClicked;
  updateTheme();
});

function updateTheme() {
  const theme = isClicked ? 'dark' : 'light';
  body.style.backgroundImage = `url('assets/images/pattern-background-mobile-${theme}.svg')`;
  body.style.color = isClicked ? 'white' : '#313E51';
  body.style.backgroundColor = isClicked ? '#313E51' : 'white';
  sunLight.style.backgroundImage = `url('assets/images/icon-sun-${theme}.svg')`;
  darkLight.style.backgroundImage = `url('assets/images/icon-moon-${theme}.svg')`;
  toggleBtn.style.transform = isClicked ? 'translateX(20px)' : 'translateX(0)';

  const bgColor = isClicked ? '#3B4D66' : 'rgb(217, 241, 247)';
  subjects.forEach(subject => subject.style.backgroundColor = bgColor);
  options.forEach(option => option.style.backgroundColor = bgColor);
}

// Quiz selection and initialization
subjects.forEach((sub) => {
  sub.addEventListener("click", () => {
    quizType = sub.getAttribute("id");
    questionScreen(quizType);
  });
});

function questionScreen(type) {
  section1.style.display = 'none';
  questionSection.classList.remove("display");
  setSubBars(type);
  loadQuizData(type);
}

function setSubBars(type) {
  const bars = document.querySelectorAll(".current-subject");
  const iconMap = {
    "HTML": "html",
    "CSS": "css",
    "JavaScript": "js",
    "Accessibility": "accessibility"
  };

  bars.forEach(bar => {
    bar.querySelector(".subject-chosen").textContent = type;
    bar.querySelector(".subject-img").src = `./assets/images/icon-${iconMap[type] || 'accessibility'}.svg`;
    bar.style.visibility = "visible";
  });
}

// Quiz data and question management
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

  document.querySelector(".numof-question").textContent = qCount + 1;
  document.querySelector(".progress").style.width = `${increment * (qCount + 1)}%`;

  submit.textContent = "Submit Answer";
  document.querySelector(".question").textContent = quizChosen.questions[qCount].question;

  options.forEach((option, index) => {
    option.classList.remove("selected", "invalid", "correct");
    option.innerHTML = `<div class='options'>${String.fromCharCode(65 + index)}</div>${quizChosen.questions[qCount].options[index]}`;
  });
}

options.forEach((option) => {
  option.addEventListener("click", function () {
    options.forEach(opt => {
      opt.classList.remove("selected");
      opt.firstElementChild.classList.remove("selected-box");
    });
    this.classList.add("selected");
    this.firstElementChild.classList.add("selected-box");
  });
});

submit.addEventListener("click", function () {
  if (submit.textContent === "Next Question") {
    makeQuestions();
    return;
  }
  if (submit.textContent === "Play Again") {
    restartQuiz();
    return;
  }

  const selectedBox = document.querySelector(".selected");
  if (!selectedBox) {
    document.querySelector(".select-prompt").style.visibility = "visible";
    return;
  }

  document.querySelector(".select-prompt").style.visibility = "hidden";
  const answerText = selectedBox.textContent.slice(1);

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

  submit.textContent = qCount >= totalQuestions - 1 ? "Play Again" : "Next Question";
});

function revealAnswers() {
  options.forEach(option => {
    const text = option.textContent.slice(1);
    if (validate(text)) {
      if (!option.classList.contains("correct")) {
        option.classList.add("correct");
        option.firstElementChild.classList.add("correct-box");
        option.innerHTML += "<img class='correct-icon' src='./assets/images/icon-correct.svg'>";
      }
    } else {
      if (!option.classList.contains("invalid")) {
        option.classList.add("invalid");
        option.firstElementChild.classList.add("invalid-box");
        option.innerHTML += "<img class='invalid-icon' src='./assets/images/icon-incorrect.svg'>";
      }
    }
  });
}

function validate(selected) {
  return quizChosen.questions[qCount].answer === selected;
}

function showQuizComplete() {
  questionSection.classList.add("display");
  scoreSection.classList.remove("display");
  document.getElementById("final-score").textContent = score;
  document.querySelector(".question-total").textContent = totalQuestions;
  
  const subLogo = document.querySelector(".sub-logo");
  subLogo.querySelector(".logo").style.backgroundImage = `url('./assets/images/icon-${quizType.toLowerCase()}.svg')`;
  subLogo.querySelector("span").textContent = quizType;
}

function restartQuiz() {
  scoreSection.classList.add("display");
  section1.style.display = 'block';
  document.querySelector(".current-subject").style.visibility = "hidden";
  qCount = -1;
  score = 0;
}

document.querySelector(".restart").addEventListener("click", restartQuiz);