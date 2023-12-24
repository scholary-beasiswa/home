const questions = [
    {
        question: 'What is the capital of France?',
        answers: [
            { text: 'Berlin', correct: false },
            { text: 'Paris', correct: true },
            { text: 'Madrid', correct: false },
            { text: 'Rome', correct: false }
        ]
    },
    {
        question: 'Which programming language is used for web development?',
        answers: [
            { text: 'Java', correct: false },
            { text: 'Python', correct: false },
            { text: 'HTML', correct: false },
            { text: 'JavaScript', correct: true }
        ]
    },
    {
        question: 'Apa ini?',
        answers: [
            { text: 'anu', correct: false },
            { text: 'itu', correct: true },
            { text: 'aje', correct: false },
            { text: 'ase', correct: false }
        ]
    },
    // Add more questions as needed
];

let currentQuestionIndex = 0;
let score = 0;
let timerInterval;
// Di bagian deklarasi variabel
let answerBackgroundColors = [];
let correctAnswerColor = 'green';
let username = localStorage.getItem('user');

const startTimeKey = `startTime_${username}`;
const scoreKey = `score_${username}`;
const quizDurationKey = `quizDuration_${username}`;

const questionContainer = document.getElementById('question-container');
const answerButtonsContainer = document.getElementById('answer-buttons');
const timerDisplay = document.getElementById('time-left');
const scoreDisplay = document.getElementById('score-display');
const nextButton = document.getElementById('next-button');
const prevButton = document.getElementById('prev-button');
const submitButton = document.getElementById('submit-button'); // Tambahkan definisi tombol "Submit"

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    // Check if the start time is already stored, if not, store it
    if (!localStorage.getItem('startTime')) {
        storeStartTime();
    }
    timeLeft = calculateRemainingTime();
    nextButton.classList.add('hide');
    submitButton.classList.add('hide');
    showQuestion(questions[currentQuestionIndex]);
    startTimer();
}

function showQuestion(question) {
    answerBackgroundColors = Array(question.answers.length).fill('');
    questionContainer.innerText = question.question;
    answerButtonsContainer.innerHTML = '';

    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        button.style.backgroundColor = answerBackgroundColors[index];
        button.addEventListener('click', () => selectAnswer(index));
        answerButtonsContainer.appendChild(button);
    });

    // Tampilkan tombol Previous jika bukan pertanyaan pertama
    if (currentQuestionIndex == 0) {
        prevButton.disabled = true;
    } else {
        prevButton.disabled = false;
    }
}

function prevQuestion() {
    currentQuestionIndex--;
    // Tampilkan pertanyaan sebelumnya
    showQuestion(questions[currentQuestionIndex]);
    nextButton.disabled = false;
}
function selectAnswer(answerIndex) {
    // Hapus kelas 'correct' dari semua tombol jawaban
    answerButtonsContainer.childNodes.forEach((button, index) => {
        button.classList.remove('correct');
        button.classList.remove('incorrect');
    });

    const correct = questions[currentQuestionIndex].answers[answerIndex].correct;
    const selectedButton = answerButtonsContainer.children[answerIndex];

    if (correct) {
        selectedButton.classList.add('correct');
        score++;
    }else {
        selectedButton.classList.add('incorrect');
    }

    nextButton.classList.remove('hide');
}

function nextQuestion() {
    currentQuestionIndex++;
    showQuestion(questions[currentQuestionIndex]);
    if (currentQuestionIndex < questions.length -1 ) {
        nextButton.classList.add('hide');
    } else {
        // Nonaktifkan tombol "Next" jika sudah di ujung pertanyaan
        nextButton.disabled = true;
    }
}
function storeStartTime() {
    const startTime = new Date().getTime();
    localStorage.setItem(startTimeKey, startTime);
}
function calculateRemainingTime() {
    const startTime = localStorage.getItem(startTimeKey);
    if (startTime) {
        const elapsedTime = new Date().getTime() - parseInt(startTime);
        const remainingTime = Math.max(600 - Math.floor(elapsedTime / 1000), 0);
        return remainingTime;
    }
}
function startTimer() {
    timeLeft = calculateRemainingTime();
    timerInterval = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        timerDisplay.innerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(timerInterval);
            if (currentQuestionIndex < questions.length - 1) {
                // If there are more questions, move to the next question
                nextQuestion();
            } else {
                // If it's the last question, show the results
                showResults();
                setTimeout(() => {
                    window.location.href = "http://127.0.0.1:5500/"; // Gantilah dengan nama file atau URL home Anda
                }, 2000);
            }
        }
    }, 1000);
}
function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}
function showResults() {
    localStorage.setItem(scoreKey, score);
    alert(`Quiz completed!\nUsername: ${username}\nYour Score: ${score}`);
    clearInterval(timerInterval);
    // Tampilkan skor dan tombol Next setelah semua soal dijawab atau timer habis
    scoreDisplay.innerText = `Score: ${score}`;
    scoreDisplay.classList.remove('hide');

    nextButton.classList.remove('hide');
    nextButton.disabled = true; // Atur tombol Next tidak dapat diklik setelah selesai
}

function submitQuiz() {
    const startTime = localStorage.getItem(startTimeKey);
    const endTime = new Date().getTime();
    const durationInSeconds = Math.floor((endTime - parseInt(startTime)) / 1000);

    // Store the duration in localStorage
    localStorage.setItem(quizDurationKey, durationInSeconds);
    // Tampilkan tombol Next setelah semua soal dijawab atau timer habis
    scoreDisplay.innerText = `Score: ${score}, Duration: ${formatDuration(durationInSeconds)}`;
    scoreDisplay.classList.remove('hide');

    nextButton.classList.remove('hide');
    nextButton.disabled = true; // Atur tombol Next tidak dapat diklik setelah selesai

    // Sembunyikan tombol Previous dan Submit setelah submit
    prevButton.classList.add('hide');
    submitButton.classList.add('hide');

    currentQuestionIndex++;
    showResults();
    setTimeout(() => {
        window.location.href = "http://127.0.0.1:5500/"; // Gantilah dengan nama file atau URL home Anda
    }, 2000);
}

// Tambahkan event listener untuk tombol "Submit"
submitButton.addEventListener('click', submitQuiz);
startQuiz();
