// Game state 

let secretNumber = Math.floor(Math.random()* 101);
let attempts = 0;
let gameOver = false;
let hintsUsed = 0;

// DOM elements 

const guessInput = document.getElementById('guessInput');
const message = document.getElementById('message');
const attemptsDisplay = document.getElementById('attempts');
const scoreDisplay = document.getElementById('score');
const submitBtn = document.getElementById('submitBtn');
const restartBtn = document.getElementById('restartBtn');
const hintBtn = document.getElementById('hintBtn');

// Initialize game

document.addEventListener('DOMContentLoaded', function(){
  guessInput.focus();
  updateDisplay();

  // Add Enter key support

  guessInput.addEventListener('keypress', function(e){
    if(e.key === 'Enter'){
      checkGuess();
    }
  });

  // Add input validation

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

  // Input validation

  if(isNaN(guess) || guess < 0 || guess > 100){
    showMessage("❗Please enter a number between 0 and 100!", 'error');
    guessInput.focus();
    return;
  }

  attempts++;
  updateDisplay();

  // Check the guess 
  
  if(guess === secretNumber){
    // Correct guess!

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
    // Too low

    const difference = secretNumber - guess;
    if(difference <= 5){
      showMessage("🔥Very close! Your guess is too low!", 'warning');
    } else if(difference <= 15){
      showMessage("📈Close! Your guess is too low!", 'warning');
    } else{
      showMessage("📉Your guess is too low!", 'error');
    }
  } else{
    // Too high 

    const difference = guess - secretNumber;
    if(difference <=5){
      showMessage("🔥Very close! Your guess is too high!", 'warning');
    } else if(difference <= 15){
      showMessage("📈Close! Your guess is too high!", 'warning');
    } else{
      showMessage("📉Your guess is too high!", 'error');
    }
  }

  // Clear input and focus 

  guessInput.value = '';
  guessInput.focus();

  // Add some encouragement based on attempts 

  if(attempts === 10 && !gameOver){
    setTimeout(()=>{
      showMessage("💪 Don't give up! You're getting closer!", 'warning');
    }, 2000);
  }
}

function showMessage(text , type = ''){
  message.textContent = text;
  message.className = `message ${type}`;

  // Add animation 

  message.style.animation = 'none';
  message.offsetHeight;  // Trigger reflow
  message.style.animation = 'messageSlider 0.5s ease-out';
}

function updateDisplay(){
  attemptsDisplay.textContent = attempts;
  const currentScore = Math.max(0, 100 - attempts - (hintsUsed * 5));
  scoreDisplay.textContent = currentScore;
}

function endGame(){
  gameOver = true;
  guessInput.disabled = true;
  submitBtn.disabled = true;
  restartBtn.style.display = 'flex';
  hintBtn.style.display = 'none';

  // Add celebration effect 

  setTimeout(()=>{
    document.body.style.animation = 'celebration 2s ease-in-out';
  }, 500);
}

function restartGame(){
  // Reset game state 

  secretNumber = Math.floor(Math.random() * 101);
  attempts = 0;
  gameOver = false;
  hintsUsed = 0;

  // Reset UI 

  guessInput.disabled = false;
  guessInput.value = '';
  submitBtn.disabled = false;
  restartBtn.style.display = 'none';
  hintBtn.style.display = 'flex';

  // Clear message and reset display 

  message.textContent = '';
  message.className = 'message';
  updateDisplay();

  // Focus input 

  guessInput.focus();

  // Remove celebration effect 

  document.body.style.animation = '';

  console.log('New game started! Secret number:', secretNumber);  // For debugging 
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

// Add celebration animation

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