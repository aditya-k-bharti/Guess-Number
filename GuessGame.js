// Game state 

let secretNumber = Math.floor(Math.random()* 101);
let attempts     = 0;
let gameOver     = false;
let hintsUsed    = 0;
let maxRange     = 100;
let timeLeft     = 60;
let timer;
let streak       = localStorage.getItem("Streak") || 0;
let history      = [];

// DOM elements 

const guessInput      = document.getElementById('guessInput');
const message         = document.getElementById('message');
const attemptsDisplay = document.getElementById('attempts');
const scoreDisplay    = document.getElementById('score');
const submitBtn       = document.getElementById('submitBtn');
const restartBtn      = document.getElementById('restartBtn');
const hintBtn         = document.getElementById('hintBtn');
const timerDisplay    = document.getElementById('timer');
const streakDisplay   = document.getElementById('streak');
const progressBar     = document.getElementById('progressBar');
const historyList     = document.getElementById('historyList');
const leaderboardList = document.getElementById('leaderboard');
const difficulty      = document.getElementById('difficulty');

// Initialize game

document.addEventListener('DOMContentLoaded', function(){
  startTimer();
  streakDisplay.textContent = streak;
  renderLeaderboard();
  showMessage("🧠 Welcome to MindHunt! Let's test your brain...", 'warning');

  function startTimer(){
    clearInterval(timer);
    timeLeft = 60;
    timerDisplay.textContent = timeLeft;

    timer = setInterval(function(){
      timeLeft--;
      timerDisplay.textContent = timeLeft;

      if(timeLeft <= 0){
        showMessage(`⌛ Time Over! Number was ${secretNumber}.`, 'error');
        streak = 0;
        endGame();
      }
    }, 1000);
  }

  function checkGuess(){
    if(gameOver) return;
    const guess = parseInt(guessInput.value);
    if(isNaN(guess)) return;
    attempts++;
    history.push(guess);
    renderHistory();
    updateProgress(guess);

    if(guess === secretNumber){
      let score = Math .max(0, 100 - attempts);
      showMessage(`🏆 Genius! You cracked ${secretNumber} in ${attempts} moves!`, 'success');
      scoreDisplay.textContent = score;
      streak++;
      localStorage.setItem("Streak", streak);
      saveScore(score);
      endGame();
    } else if(attempts >= 10){
      showMessage(`💀 Game Over! The number was ${secretNumber}.`, 'error');
      streak = 0;
      localStorage.setItem("Streak", streak);
      endGame();
    } else{
      showMessage(guess < secretNumber ? "📉 Too Low!" : "📈 Too High!", 'warning');
    }
    guessInput.focus();
    updateDisplay();
  }

  function updateProgress(guess){
    let percent = (guess / maxRange) * 100;
    progressBar.style.width = `${percent}%`;
  }

  function renderHistory(){
    historyList.innerHTML = '';
    history.forEach(num =>{
      let li = document.createElement('li');
      li.textContent = num;
      historyList.appendChild(li);
    });
  }

  function saveScore(score){
    let scores = JSON.parse(localStorage.getItem("Scores")) || [];
    scores.push(score);
    scores.sort((a,b) => b - a);
    localStorage.setItem("Scores", JSON.stringify(scores));
    renderLeaderboard();
  }

  function renderLeaderboard(){
    let scores = JSON.parse(localStorage.getItem("Scores")) || [];
    leaderboardList.innerHTML = '';
    scores.slice(0,5).forEach(s =>{
      let li = document.createElement('li');
      li.textContent = "⭐ " + s;
      leaderboardList.appendChild(li);
    });
  }

  guessInput.addEventListener('keypress', function(e){
    if(e.key === 'Enter'){
      checkGuess();
    }
  });

  guessInput.addEventListener('input', function(){
    const value = parseInt(this.value);
    if(value < 0){
      this.value = 0;
    }
    if(value > 100){
      this.value = 100;
    }
  });
});

function checkGuess(){
  if(gameOver){
    return;
  }
  const guess = parseInt(guessInput.value);

  if(isNaN(guess) || guess < 0 || guess > 100){
    showMessage("❗Please enter a number between 0 and 100!", 'error');
    guessInput.focus();
    return;
  }

  attempts++;
  updateDisplay();
  
  if(guess === secretNumber){
    let finalScore;
    if(attempts === 1){
      finalScore = 100;
    } else{
      finalScore = Math.max(0, 100 - attempts -(hintsUsed * 5));
    }
    showMessage(`🎉Congratulations! You found the number ${secretNumber}!`, 'success');
    scoreDisplay.textContent = finalScore;
    endGame();
  } else if(guess < secretNumber){
    const difference = secretNumber - guess;
    if(difference <= 5){
      showMessage("🔥Very close! Your guess is too low!", 'warning');
    } else if(difference <= 15){
      showMessage("📈Close! Your guess is too low!", 'warning');
    } else{
      showMessage("📉Your guess is too low!", 'error');
    }
  } else{
    const difference = guess - secretNumber;
    if(difference <=5){
      showMessage("🔥Very close! Your guess is too high!", 'warning');
    } else if(difference <= 15){
      showMessage("📈Close! Your guess is too high!", 'warning');
    } else{
      showMessage("📉Your guess is too high!", 'error');
    }
  }

  guessInput.value = '';
  guessInput.focus();

  if(attempts === 10 && !gameOver){
    setTimeout(()=>{
      showMessage("💪 Don't give up! You're getting closer!", 'warning');
    }, 2000);
  }
}

function showMessage(text , type = ''){
  message.textContent = text;
  message.className = `message ${type}`;

  message.style.animation = 'none';
  message.offsetHeight;  // Trigger reflow
  message.style.animation = 'messageSlider 0.5s ease-out';
}

function updateDisplay(){
  attemptsDisplay.textContent = attempts;
  const currentScore = Math.max(0, 100 - attempts - (hintsUsed * 5));
  scoreDisplay.textContent = currentScore;
  streakDisplay.textContent = streak;
}

function endGame(){
  gameOver = true;
  clearInterval(timer);
  submitBtn.disabled = true;
  restartBtn.style.display = 'flex';
  hintBtn.style.display = 'none';

  setTimeout(()=>{
    document.body.style.animation = 'celebration 2s ease-in-out';
  }, 500);
}

function restartGame(){
  maxRange = parseInt(difficulty.value);
  secretNumber = Math.floor(Math.random() * maxRange); 
  attempts = 0;
  gameOver = false;
  hintsUsed = 0;
  history = [];
  submitBtn.disabled = false;
  restartBtn.style.display = 'none';
  progressBar.style.width = '0%';
  renderHistory();
  updateDisplay();
  startTimer();
}

function getHint(){
  if(gameOver || hintsUsed >= 3){
    return;
  }
  hintsUsed++;
  updateDisplay();

  let hintMessage = '';
  switch(hintsUsed){
    case 1: 
      hintMessage = secretNumber % 2 === 0 ? "💡 Hint: The number is even!" : "💡 Hint: The number is odd!";
      break;
    case 2:
      if(secretNumber <= 25){
        hintMessage = "💡 Hint: The number is 25 or less!";
      }  else if(secretNumber <= 50){
        hintMessage = "💡 Hint: The number is between 26-50!";
      } else if(secretNumber <= 75){
        hintMessage = "💡 Hint: The number is between 51-75!";
      } else{
        hintMessage = "💡 Hint: The number is 76 or higher!";
      }
      break;
    case 3:
      const firstDigit = Math.floor(secretNumber / 10);
      hintMessage = secretNumber < 10 ? "💡 Hint: It's a single digit number!" : `💡 Hint: The first digit is ${firstDigit}!`;
      hintBtn.style.display = 'none';
      break;
  }

  showMessage(hintMessage, 'warning');
  if(hintsUsed >= 3){
    hintBtn.style.display = 'none';
  }
}

const style = document.createElement('style');
style.textContent = `
  @keyframes celebration{
  0%, 100%{
    transform: scale(1);
  }
  25%{
    transform: scale(1.02);
  }
  50%{
    transform: scale(1.01);
  }
  75%{
    transform: scale(1.02);
  }
}`;

document.head.appendChild(style);

// Console welcome message 

console.log('🎯 Guess the Number Game loaded!');
console.log('Secret number for this round:', secretNumber);