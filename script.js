const startBtn = document.getElementById('start-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const endScreen = document.getElementById('end-screen');
const questionCounter = document.getElementById('question-counter');
const questionText = document.getElementById('question-text');
const answerButtons = document.getElementById('answer-buttons');
const feedback = document.getElementById('feedback');
const progressText = document.querySelector('.progress');
const finalScore = document.getElementById('final-score');
const perfectMessage = document.getElementById('perfect-message');
const difficultySelect = document.getElementById('difficulty');
const goalText = document.getElementById('goal-text');

let currentQuestion = 0;
let score = 0;
let quizSet = [];
let timerInterval = null;
let timeLeft = 0;
const TIMER_HARD = 10; // seconds per question in Hard mode

// Expanded and categorized questions
const easyQuestions = [
  {
    question: "What does charity: water help provide?",
    answers: ["Clean water", "Electricity", "Books", "Shoes"],
    correct: 0,
  },
  {
    question: "What color is the charity: water logo can?",
    answers: ["Red", "Yellow", "Blue", "Green"],
    correct: 1,
  },
  {
    question: "What is a well used for?",
    answers: ["Growing crops", "Getting water", "Making bricks", "Catching fish"],
    correct: 1,
  },
  {
    question: "What is the main ingredient in water?",
    answers: ["Oxygen", "Hydrogen", "H2O", "Salt"],
    correct: 2,
  },
  {
    question: "What do people use to carry water in many countries?",
    answers: ["Jerry can", "Backpack", "Basket", "Suitcase"],
    correct: 0,
  },
  // ...add more easy questions as needed...
];

const normalQuestions = [
  {
    question: "How many people lack access to clean water?",
    answers: ["About 600 million", "About 800 million", "About 1 billion", "About 1.2 billion"],
    correct: 1,
  },
  {
    question: "What percentage of the earth’s surface is water?",
    answers: ["50%", "60%", "71%", "90%"],
    correct: 2,
  },
  {
    question: "What is one major cause of unsafe drinking water?",
    answers: ["Plastic straws", "Oil spills", "Human waste", "Mosquitoes"],
    correct: 2,
  },
  {
    question: "How many children die each day due to water-related diseases?",
    answers: ["100", "500", "800", "Over 1,000"],
    correct: 3,
  },
  {
    question: "Where does charity: water primarily work?",
    answers: ["Asia", "Africa", "South America", "North America"],
    correct: 1,
  },
  {
    question: "What year was charity: water founded?",
    answers: ["2002", "2006", "2010", "2015"],
    correct: 1,
  },
  {
    question: "How is charity: water's operating cost covered?",
    answers: ["Government grants", "Corporate donors", "Private donors fund overhead", "Merchandise sales"],
    correct: 2,
  },
  {
    question: "What is a jerry can used for in many parts of the world?",
    answers: ["Storing food", "Carrying water", "Cooking oil", "Holding money"],
    correct: 1,
  },
  {
    question: "How far do some people walk daily to collect water?",
    answers: ["500 feet", "1 mile", "2 miles", "Over 3 miles"],
    correct: 3,
  },
  {
    question: "What does clean water help reduce?",
    answers: ["Road accidents", "Waterborne diseases", "Mosquito bites", "Electricity use"],
    correct: 1,
  },
  {
    question: "Which country has benefited from charity: water projects?",
    answers: ["India", "Brazil", "Kenya", "United States"],
    correct: 2,
  },
  {
    question: "What technology is often used to find underground water?",
    answers: ["GPS", "Ground-penetrating radar", "Seismograph", "Metal detector"],
    correct: 1,
  },
  // ...add more normal questions as needed...
];

const hardQuestions = [
  {
    question: "What percentage of every donation to charity: water goes directly to water projects?",
    answers: ["50%", "75%", "100%", "90%"],
    correct: 2,
  },
  {
    question: "How many countries has charity: water worked in?",
    answers: ["10", "29", "50", "Over 29"],
    correct: 3,
  },
  {
    question: "What is the average distance women walk for water in Africa?",
    answers: ["1 mile", "3.7 miles", "5 miles", "10 miles"],
    correct: 1,
  },
  {
    question: "What is the leading cause of death for children under 5 in sub-Saharan Africa?",
    answers: ["Malaria", "Waterborne diseases", "Malnutrition", "HIV/AIDS"],
    correct: 1,
  },
  {
    question: "What is the main reason girls miss school in developing countries?",
    answers: ["No teachers", "No books", "Collecting water", "No uniforms"],
    correct: 2,
  },
  {
    question: "What is the most common waterborne disease?",
    answers: ["Cholera", "Malaria", "Typhoid", "Dysentery"],
    correct: 0,
  },
  {
    question: "How many liters does a jerry can hold?",
    answers: ["5", "10", "20", "50"],
    correct: 2,
  },
  {
    question: "What is the minimum daily water requirement per person for drinking, cooking, and cleaning?",
    answers: ["5 liters", "10 liters", "20 liters", "50 liters"],
    correct: 2,
  },
  {
    question: "What is the main source of funding for charity: water's water projects?",
    answers: ["Government", "Public donations", "Corporate sponsors", "Merchandise sales"],
    correct: 1,
  },
  {
    question: "What is the most common method charity: water uses to provide clean water?",
    answers: ["Rainwater harvesting", "Drilled wells", "Desalination", "Water trucks"],
    correct: 1,
  },
  // ...add more hard questions as needed...
];

// Difficulty settings
const DIFFICULTY_SETTINGS = {
  easy: { questions: 5, questionSet: easyQuestions, timer: null },
  normal: { questions: 7, questionSet: normalQuestions, timer: null },
  hard: { questions: 10, questionSet: hardQuestions, timer: TIMER_HARD },
};

let selectedDifficulty = 'normal';
let questionsToAsk = 7;
let timerEnabled = false;

difficultySelect.addEventListener('change', (e) => {
  selectedDifficulty = e.target.value;
  questionsToAsk = DIFFICULTY_SETTINGS[selectedDifficulty].questions;
  timerEnabled = !!DIFFICULTY_SETTINGS[selectedDifficulty].timer;
  // Update progress and goal text
  progressText.textContent = `0/${questionsToAsk} Questions Answered`;
  goalText.textContent = `Answer ${questionsToAsk} questions correctly to fill your well and earn a reward!`;
});

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function showScreen(screen) {
  startScreen.classList.remove('active');
  quizScreen.classList.remove('active');
  endScreen.classList.remove('active');
  screen.classList.add('active');

  if (screen === startScreen) {
    // Reset progress and goal text on return to start
    questionsToAsk = DIFFICULTY_SETTINGS[selectedDifficulty].questions;
    progressText.textContent = `0/${questionsToAsk} Questions Answered`;
    goalText.textContent = `Answer ${questionsToAsk} questions correctly to fill your well and earn a reward!`;
  }
}

function updateProgress() {
  progressText.textContent = `${score}/${questionsToAsk} Questions Answered`;
}

function showQuestion() {
  const q = quizSet[currentQuestion];
  questionCounter.textContent = `Question ${currentQuestion + 1}/${questionsToAsk}`;
  questionText.textContent = q.question;
  answerButtons.innerHTML = '';
  feedback.textContent = '';

  // Timer for hard mode
  if (timerEnabled) {
    startTimer();
  }

  q.answers.forEach((answer, index) => {
    const btn = document.createElement('button');
    btn.textContent = answer;
    btn.classList.add('btn');
    btn.addEventListener('click', () => handleAnswer(index === q.correct));
    answerButtons.appendChild(btn);
  });
}

function startTimer() {
  clearInterval(timerInterval);
  timeLeft = DIFFICULTY_SETTINGS[selectedDifficulty].timer;
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      feedback.textContent = 'Time\'s up!';
      feedback.style.color = 'red';
      setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < quizSet.length) {
          showQuestion();
        } else {
          showEndScreen();
        }
      }, 1000);
    }
  }, 1000);
}

function updateTimerDisplay() {
  let timerDiv = document.getElementById('timer');
  if (!timerDiv) {
    timerDiv = document.createElement('div');
    timerDiv.id = 'timer';
    timerDiv.style.fontWeight = 'bold';
    timerDiv.style.marginBottom = '8px';
    timerDiv.style.color = '#c00';
    questionCounter.parentNode.insertBefore(timerDiv, questionCounter.nextSibling);
  }
  timerDiv.textContent = timerEnabled ? `Time left: ${timeLeft}s` : '';
}

function stopTimer() {
  clearInterval(timerInterval);
  updateTimerDisplay();
}

function handleAnswer(isCorrect) {
  if (timerEnabled) stopTimer();
  if (isCorrect) {
    feedback.textContent = 'Correct!';
    feedback.style.color = 'green';
    score++;
    updateProgress();
    // Milestone message
    if (score === Math.ceil(questionsToAsk / 2)) {
      feedback.textContent = 'Halfway there! 🚰';
      feedback.style.color = '#0077c2';
    }
  } else {
    feedback.textContent = 'Incorrect.';
    feedback.style.color = 'red';
  }

  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < quizSet.length) {
      showQuestion();
    } else {
      showEndScreen();
    }
  }, 1000);
}

function showEndScreen() {
  showScreen(endScreen);
  finalScore.textContent = `You got ${score} out of ${questionsToAsk} questions correct!`;
  if (score === questionsToAsk) {
    perfectMessage.textContent = "🎉 Perfect score! You're making a big splash! 💧";
    launchConfetti();
    perfectMessage.style.display = '';
  } else {
    perfectMessage.textContent = '';
    perfectMessage.style.display = 'none';
  }
  stopTimer();
}

function launchConfetti() {
  if (typeof confetti !== 'undefined') {
    confetti({
      particleCount: 200,
      spread: 70,
      origin: { y: 0.6 },
    });
  }
}

function startGame() {
  currentQuestion = 0;
  score = 0;
  selectedDifficulty = difficultySelect.value;
  questionsToAsk = DIFFICULTY_SETTINGS[selectedDifficulty].questions;
  timerEnabled = !!DIFFICULTY_SETTINGS[selectedDifficulty].timer;
  updateProgress();
  // Pick random questions for the selected difficulty
  quizSet = shuffle([...DIFFICULTY_SETTINGS[selectedDifficulty].questionSet]).slice(0, questionsToAsk);
  showScreen(quizScreen);
  showQuestion();
}

startBtn.addEventListener('click', startGame);
playAgainBtn.addEventListener('click', () => {
  showScreen(startScreen);
});





