// Game state 

let attempts     = 0;
let gameOver     = false;
let hintsUsed    = 0;
let maxRange     = 100;
let secretNumber = Math.floor(Math.random()* maxRange);
let timeLeft     = 60;
let timer;
let streak       = localStorage.getItem("Streak") || 0;
let history      = [];
let gameStarted  = false;
let messageTimeout;

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

// Initialize game

document.addEventListener('DOMContentLoaded', function(){
  streakDisplay.textContent = streak;
  renderLeaderboard();
  showMessage("🧠 Welcome to MindHunt! Let's test your brain...", 'warning');

  guessInput.disabled = true;
  submitBtn.textContent = "🎯 Start Hunt";
  guessInput.placeholder = `Enter number (0 - ${maxRange})`;
  guessInput.max = maxRange;
  updateDifficultyColor(maxRange);

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
    if(value > maxRange){
      this.value = maxRange;
    }
  });
});

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

function updateProgress(guess){
  let diff = Math.abs(secretNumber - guess);
  let percent = 100 - (diff / maxRange) * 100;
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

function handleGameStart(){
  if(!gameStarted){
    gameStarted = true;
    guessInput.disabled = false;
    submitBtn.textContent = '🚀 Fire Guess';
    startTimer();
  } else{
    checkGuess();
  }
}

function updateDifficultyColor(range){
  if(range === 50){
    difficultyBtn.style.background = "linear-gradient(135deg, #2ecc71, #27ae60)";
  } else if(range === 100){
    difficultyBtn.style.background = "linear-gradient(135deg, #3498db, #2980b9)";
  } else if(range === 500){
    difficultyBtn.style.background = "linear-gradient(135deg, #e74c3c, #c0392b)";
  }
}

function updateBadge(score){
  const badge = document.getElementById("badge");
  if(score >= 80){
    badge.textContent = "🏆 Legend";
  } else if(score >= 50){
    badge.textContent = "🔥 Pro";
  } else{
    badge.textContent = "😅 Beginner";
  }
}

function checkGuess(){
  if(gameOver){
    return;
  }
  const guess = parseInt(guessInput.value);

  if(isNaN(guess) || guess < 0 || guess > maxRange){
    showMessage(`❗Enter number between 0 - ${maxRange}!`, 'error');
    guessInput.focus();
    return;
  }
  
  updateProgress(guess);
  history.push(guess);
  renderHistory()
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
    saveScore(finalScore);
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

  message.classList.add('show');

  clearTimeout(messageTimeout);

  messageTimeout = setTimeout(() =>{
    message.classList.remove('show');
    setTimeout(() =>{
      message.textContent = "";
      message.className = 'message';
    }, 300);
  }, 4000);
}

function updateDisplay(){
  attemptsDisplay.textContent = attempts;
  const currentScore = Math.max(0, 100 - attempts - (hintsUsed * 5));
  scoreDisplay.textContent = currentScore;
  streakDisplay.textContent = streak;
  updateBadge(currentScore);
}

function endGame(){
  gameOver = true;
  clearInterval(timer);
  const finalScore = parseInt(scoreDisplay.textContent);
  updateBadge(finalScore);
  submitBtn.disabled = true;
  restartBtn.style.display = 'flex';
  hintBtn.style.display = 'none';

  setTimeout(()=>{
    document.body.style.animation = 'celebration 2s ease-in-out';
  }, 500);
}

function restartGame(){
  clearInterval(timer);
  secretNumber = Math.floor(Math.random() * maxRange); 
  attempts = 0;
  gameOver = false;
  hintsUsed = 0;
  history = [];
  gameStarted = false;
  guessInput.disabled = true;
  submitBtn.textContent = "🎯 Start Hunt";
  submitBtn.disabled = false;
  restartBtn.style.display = 'none';
  hintBtn.style.display = 'flex';
  progressBar.style.width = '0%';
  renderHistory();
  updateDisplay();
  timeLeft = 60;
  timerDisplay.textContent = timeLeft;
  showMessage("🧠 New Game! Click Start Hunt to begin.", 'warning');
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

const difficultyBtn = document.getElementById('difficultyBtn')
const difficultyOptions = document.getElementById('difficultyOptions');
const items = document.querySelectorAll('.sort-item');

difficultyBtn.addEventListener('click', () =>{
  difficultyOptions.classList.toggle("show");
  difficultyBtn.classList.toggle('active');
});

items.forEach(item => {
  item.addEventListener("click", () =>{
    const newRange = parseInt(item.dataset.value);
    if(gameStarted){
      if(timeLeft <= 30){
        showMessage("⛔ Cannot change difficulty after 30s!", "error");
        difficultyOptions.classList.remove("show");
        difficultyBtn.classList.remove("active");
        return;
      }
      
      maxRange = newRange;
      updateDifficultyColor(maxRange);
      guessInput.placeholder = `Enter number (0 - ${maxRange})`;
      guessInput.max = maxRange;
      secretNumber = Math.floor(Math.random() * maxRange);
      clearInterval(timer);
      gameStarted = false;
      guessInput.disabled = true;
      submitBtn.textContent = "🎯 Start Hunt";
      timeLeft = 60;
      timerDisplay.textContent = timeLeft;
      history = [];
      attempts = 0;
      progressBar.style.width = "0%";
      updateDisplay();
      showMessage(`🔄 Difficulty changed! Now guess between 0 - ${maxRange}`, "warning");
      difficultyBtn.textContent = `Difficulty: ${item.textContent}`;
      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      difficultyOptions.classList.remove("show");
      difficultyBtn.classList.remove('active');
      restartGame();
      return;
    }

    maxRange = newRange;
    updateDifficultyColor(maxRange);
    guessInput.placeholder = `Enter number (0 - ${maxRange})`;
    guessInput.max = maxRange;
    secretNumber = Math.floor(Math.random() * maxRange);
    showMessage(`🎯 Difficulty set! Guess between 0 - ${maxRange}`, "success");
    difficultyBtn.textContent = `Difficulty: ${item.textContent}`;
    items.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    difficultyOptions.classList.remove("show");
    difficultyBtn.classList.remove('active');
  });
});

document.addEventListener('click', (e) => {
  if(!e.target.closest(".filter-wrapper")){
    difficultyOptions.classList.remove("show");
    difficultyBtn.classList.remove("active");
  }
});

console.log('Secret number for this round:', secretNumber);