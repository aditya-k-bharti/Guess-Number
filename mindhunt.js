// ===== MindHunt Game Logic =====
let mhAttempts = 0;
let mhGameOver = false;
let mhHintsUsed = 0;
let mhMaxRange = 100;
let mhSecret = Math.floor(Math.random() * mhMaxRange);
let mhTimeLeft = 60;
let mhTimer;
let mhStreak = parseInt(localStorage.getItem('mhStreak')) || 0;
let mhHistory = [];
let mhGameStarted = false;
let mhToastTimeout;

// DOM refs
const mhInput = document.getElementById('mh-input');
const mhSubmitBtn = document.getElementById('mh-submit-btn');
const mhRestartBtn = document.getElementById('mh-restart-btn');
const mhHintBtn = document.getElementById('mh-hint-btn');
const mhTimerVal = document.getElementById('mh-timer-val');
const mhAttemptsVal = document.getElementById('mh-attempts-val');
const mhScoreVal = document.getElementById('mh-score-val');
const mhStreakVal = document.getElementById('mh-streak-val');
const mhBadge = document.getElementById('mh-badge');
const mhProgress = document.getElementById('mh-progress');
const mhHistoryList = document.getElementById('mh-history');
const mhLeaderboard = document.getElementById('mh-leaderboard');
const mhDiffBtn = document.getElementById('mh-diff-btn');
const mhDiffDrop = document.getElementById('mh-diff-dropdown');
const mhDiffLabel = document.getElementById('mh-diff-label');
const mhToast = document.getElementById('mh-toast');

//Init
document.addEventListener('DOMContentLoaded', () => {
  mhStreakVal.textContent = mhStreak;
  mhRenderLeaderboard();
  mhShowToast("🧠 Welcome to MindHunt! Click Start Hunt.", 'warning');

  mhInput.addEventListener('keydown', e => {
    if(e.key === 'Enter') mhHandleStart();
  });

  mhInput.addEventListener('input', () => {
    const v = parseInt(mhInput.value);
    if(v < 0) mhInput.value = 0;
    if(v > mhMaxRange) mhInput.value = mhMaxRange;
  });

  // Difficulty dropdown
  mhDiffBtn.addEventListener('click', () => {
    mhDiffDrop.classList.toggle('open');
    mhDiffBtn.classList.toggle('open');
  });

  document.querySelectorAll('#mh-diff-dropdown .diff-item').forEach(item => {
    item.addEventListener('click', () => {
      const newRange = parseInt(item.dataset.value);
      if(mhGameStarted && mhTimeLeft <= 30){
        mhShowToast("⛔ Cannot change difficulty after 30s!", 'error');
        mhDiffDrop.classList.remove('open');
        mhDiffBtn.classList.remove('open');
        return;
      }
      mhMaxRange = newRange;
      mhDiffLabel.textContent = item.textContent.trim();
      mhInput.placeholder = `Enter number (0 – ${mhMaxRange})`;
      mhInput.max = mhMaxRange;
      document.querySelectorAll('#mh-diff-dropdown .diff-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      mhDiffDrop.classList.remove('open');
      mhDiffBtn.classList.remove('open');
      if(mhGameStarted) mhRestart();
      else{
        mhSecret = Math.floor(Math.random() * mhMaxRange);
        mhShowToast(`🎯 Difficulty set! Guess between 0 – ${mhMaxRange}`, 'success');
      }
    });
  });

  document.addEventListener('click', e => {
    if(!e.target.closest('#mh-diff-btn') && !e.target.closest('#mh-diff-dropdown')){
      mhDiffDrop.classList.remove('open');
      mhDiffBtn.classList.remove('open');
    }
  });

  console.log('🎯 MindHunt loaded. Secret (dev):', mhSecret);
});

function mhHandleStart(){
  if(!mhGameStarted){
    mhGameStarted = true;
    mhInput.disabled = false;
    mhSubmitBtn.textContent = '🚀 Fire Guess';
    mhStartTimer();
    mhInput.focus();
  } else{
    mhCheckGuess();
  }
}

function mhCheckGuess(){
  if(mhGameOver) return;
  const guess = parseInt(mhInput.value);

  if(isNaN(guess) || guess < 0 || guess > mhMaxRange){
    mhShowToast(`❗ Enter a number between 0 – ${mhMaxRange}`, 'error');
    mhInput.focus();
    return;
  }

  mhUpdateProgress(guess);
  mhHistory.push(guess);
  mhRenderHistory();
  mhAttempts++;
  mhUpdateDisplay();

  if(guess === mhSecret){
    const finalScore = mhAttempts === 1 ? 100 : Math.max(0, 100 - mhAttempts - mhHintsUsed * 5);
    mhScoreVal.textContent = finalScore;
    mhStreak = parseInt(localStorage.getItem('mhStreak') || '0') + 1;
    localStorage.setItem('mhStreak', mhStreak);
    mhSaveScore(finalScore);
    mhShowToast(`🎉 Got it! The number was ${mhSecret}!`, 'success');
    mhEndGame();
  } else if(guess < mhSecret){
    const diff = mhSecret - guess;
    if(diff <= 5) mhShowToast("🔥 Very close! Too low!", 'warning');
    else if(diff <= 15) mhShowToast("📈 Close! Too low.", 'warning');
    else mhShowToast("📉 Too low!", 'error');
  } else{
    const diff = guess - mhSecret;
    if(diff <= 5) mhShowToast("🔥 Very close! Too high!", 'warning');
    else if(diff <= 15) mhShowToast("📈 Close! Too high.", 'warning');
    else mhShowToast("📉 Too high!", 'error');
  }

  mhInput.value = '';
  mhInput.focus();

  if(mhAttempts === 10 && !mhGameOver){
    setTimeout(() => mhShowToast("💪 Don't give up! Getting warmer...", 'warning'), 2500);
  }
}

function mhUpdateProgress(guess){
  const diff = Math.abs(mhSecret - guess);
  const pct = 100 - (diff / mhMaxRange) * 100;
  mhProgress.style.width = `${Math.max(0, pct)}%`;
}

function mhStartTimer(){
  clearInterval(mhTimer);
  mhTimeLeft = 60;
  mhTimerVal.textContent = mhTimeLeft;

  mhTimer = setInterval(() => {
    mhTimeLeft--;
    mhTimerVal.textContent = mhTimeLeft;

    if(mhTimeLeft <= 10) mhTimerVal.style.color = '#ff5f5f';
    else mhTimerVal.style.color = 'var(--teal)';

    if(mhTimeLeft <= 0){
      mhShowToast(`⌛ Time's up! Number was ${mhSecret}.`, 'error');
      mhStreak = 0;
      localStorage.setItem('mhStreak', '0');
      mhEndGame();
    }
  }, 1000);
}

function mhEndGame(){
  mhGameOver = true;
  clearInterval(mhTimer);
  mhSubmitBtn.disabled = true;
  mhRestartBtn.style.display = 'flex';
  mhHintBtn.style.display = 'none';
  mhUpdateDisplay();
}

function mhRestart(){
  clearInterval(mhTimer);
  mhSecret = Math.floor(Math.random() * mhMaxRange);
  mhAttempts = 0;
  mhGameOver = false;
  mhHintsUsed = 0;
  mhHistory = [];
  mhGameStarted = false;

  mhInput.disabled = true;
  mhInput.value = '';
  mhTimerVal.style.color = 'var(--teal)';
  mhTimerVal.textContent = '60';
  mhSubmitBtn.textContent = '🎯 Start Hunt';
  mhSubmitBtn.disabled = false;
  mhRestartBtn.style.display = 'none';
  mhHintBtn.style.display = 'flex';
  mhProgress.style.width = '0%';

  mhRenderHistory();
  mhUpdateDisplay();
  mhShowToast("🧠 New Game! Click Start Hunt to begin.", 'warning');
  console.log('🎯 MindHunt new secret (dev):', mhSecret);
}

function mhGetHint(){
  if(mhGameOver || mhHintsUsed >= 3) return;
  if(!mhGameStarted){
    mhShowToast("▶️ Start the game first!", 'warning');
    return;
  }

  mhHintsUsed++;
  mhUpdateDisplay();

  let msg = '';
  switch(mhHintsUsed){
    case 1:
      msg = mhSecret % 2 === 0 ? "💡 Hint: The number is even!" : "💡 Hint: The number is odd!";
      break;
    case 2:
      if(mhSecret <= Math.floor(mhMaxRange * 0.25)) msg = `💡 Hint: Number is in the lowest 25%!`;
      else if(mhSecret <= Math.floor(mhMaxRange * 0.5))  msg = `💡 Hint: Number is in the lower half!`;
      else if(mhSecret <= Math.floor(mhMaxRange * 0.75)) msg = `💡 Hint: Number is in the upper half!`;
      else msg = `💡 Hint: Number is in the top 25%!`;
      break;
    case 3:
      const d = Math.floor(mhSecret / 10);
      msg = mhSecret < 10 ? "💡 Hint: It's a single digit!" : `💡 Hint: Starts with digit ${d}!`;
      mhHintBtn.style.display = 'none';
      break;
  }
  mhShowToast(msg, 'warning');
}

function mhUpdateDisplay(){
  mhAttemptsVal.textContent = mhAttempts;
  mhStreakVal.textContent = mhStreak;
  const score = mhAttempts === 0 ? 100 : Math.max(0, 100 - mhAttempts - mhHintsUsed * 5);
  mhScoreVal.textContent = score;

  if(score >= 80){
    mhBadge.textContent = '🏆 Legend';
  } else if(score >= 50){
    mhBadge.textContent = '🔥 Pro';
  } else{
    mhBadge.textContent = '😅 Beginner';
  }
}

function mhRenderHistory(){
  mhHistoryList.innerHTML = '';
  mhHistory.forEach(n => {
    const li = document.createElement('li');
    li.textContent = n;
    mhHistoryList.appendChild(li);
  });
}

function mhSaveScore(s){
  let scores = JSON.parse(localStorage.getItem('mhScores')) || [];
  scores.push(s);
  scores.sort((a,b) => b - a);
  localStorage.setItem('mhScores', JSON.stringify(scores));
  mhRenderLeaderboard();
}

function mhRenderLeaderboard(){
  const scores = JSON.parse(localStorage.getItem('mhScores')) || [];
  mhLeaderboard.innerHTML = '';
  scores.slice(0, 5).forEach(s => {
    const li = document.createElement('li');
    li.textContent = '⭐ ' + s;
    mhLeaderboard.appendChild(li);
  });
}

function mhShowToast(text, type = ''){
  mhToast.textContent = text;
  mhToast.className = type;
  mhToast.classList.add('show');
  clearTimeout(mhToastTimeout);
  mhToastTimeout = setTimeout(() => {
    mhToast.classList.remove('show');
  }, 4000);
}