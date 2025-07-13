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

let currentQuestion = 0;
let score = 0;
let quizSet = [];

const allQuestions = [
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
];

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function showScreen(screen) {
  startScreen.classList.remove('active');
  quizScreen.classList.remove('active');
  endScreen.classList.remove('active');
  screen.classList.add('active');
}

function updateProgress() {
  progressText.textContent = `${score}/5 Questions Answered`;
}

function showQuestion() {
  const q = quizSet[currentQuestion];
  questionCounter.textContent = `Question ${currentQuestion + 1}/5`;
  questionText.textContent = q.question;
  answerButtons.innerHTML = '';
  feedback.textContent = '';

  q.answers.forEach((answer, index) => {
    const btn = document.createElement('button');
    btn.textContent = answer;
    btn.classList.add('btn');
    btn.addEventListener('click', () => handleAnswer(index === q.correct));
    answerButtons.appendChild(btn);
  });
}

function handleAnswer(isCorrect) {
  if (isCorrect) {
    feedback.textContent = 'Correct!';
    feedback.style.color = 'green';
    score++;
    updateProgress();
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
  finalScore.textContent = `You got ${score} out of 5 questions correct!`;
  if (score === 5) {
    perfectMessage.textContent = "🎉 Perfect score! You're making a big splash! 💧";
    launchConfetti();
  } else {
    perfectMessage.textContent = '';
  }
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
  updateProgress();
  quizSet = shuffle([...allQuestions]).slice(0, 5);
  showScreen(quizScreen);
  showQuestion();
}

startBtn.addEventListener('click', startGame);
playAgainBtn.addEventListener('click', startGame);





