// Hangman Game Logic
const HM_WORDS = [
  { word: 'JAVASCRIPT', category: 'Technology' },
  { word: 'ALGORITHM',  category: 'Computer Science' },
  { word: 'KEYBOARD',   category: 'Technology' },
  { word: 'BROWSER',    category: 'Technology' },
  { word: 'FUNCTION',   category: 'Programming' },
  { word: 'VARIABLE',   category: 'Programming' },
  { word: 'ELEPHANT',   category: 'Animals' },
  { word: 'GIRAFFE',    category: 'Animals' },
  { word: 'PENGUIN',    category: 'Animals' },
  { word: 'DOLPHIN',    category: 'Animals' },
  { word: 'VOLCANO',    category: 'Geography' },
  { word: 'PYRAMID',    category: 'Landmarks' },
  { word: 'GUITAR',     category: 'Music' },
  { word: 'SYMPHONY',   category: 'Music' },
  { word: 'DIAMOND',    category: 'Gems' },
  { word: 'THUNDER',    category: 'Nature' },
  { word: 'BLIZZARD',   category: 'Weather' },
  { word: 'COMPASS',    category: 'Tools' },
  { word: 'LANTERN',    category: 'Objects' },
  { word: 'CRYSTAL',    category: 'Nature' },
  { word: 'PHANTOM',    category: 'Fantasy' },
  { word: 'ECLIPSE',    category: 'Astronomy' },
  { word: 'NEBULA',     category: 'Astronomy' },
  { word: 'GRAVITY',    category: 'Physics' },
  { word: 'PHOTON',     category: 'Physics' },
  { word: 'PIONEER',    category: 'People' },
  { word: 'SURGEON',    category: 'Jobs' },
  { word: 'ARCHITECT',  category: 'Jobs' },
  { word: 'WHISPER',    category: 'Actions' },
  { word: 'JOURNEY',    category: 'Travel' },
  { word: 'HORIZON',    category: 'Nature' },
  { word: 'BALANCE',    category: 'Concepts' },
  { word: 'FREEDOM',    category: 'Concepts' },
  { word: 'COURAGE',    category: 'Concepts' },
  { word: 'MYSTERY',    category: 'Concepts' },
  { word: 'QUANTUM',    category: 'Physics' },
  { word: 'OXYGEN',     category: 'Chemistry' },
  { word: 'CARBON',     category: 'Chemistry' },
  { word: 'CIRCUIT',    category: 'Electronics' },
  { word: 'BATTERY',    category: 'Electronics' },
  { word: 'MONSOON',    category: 'Weather' },
  { word: 'GLACIER',    category: 'Geography' },
  { word: 'CACTUS',     category: 'Plants' },
  { word: 'BLOSSOM',    category: 'Plants' },
  { word: 'FALCON',     category: 'Animals' },
  { word: 'JAGUAR',     category: 'Animals' },
  { word: 'COBALT',     category: 'Colors' },
  { word: 'CRIMSON',    category: 'Colors' },
  { word: 'EMERALD',    category: 'Gems' },
  { word: 'SAPPHIRE',   category: 'Gems' },
];

const HM_BODY_PARTS = ['hm-head','hm-body','hm-larm','hm-rarm','hm-lleg','hm-rleg'];
const MAX_WRONG = 6;

let hmWord = '';
let hmCategory = '';
let hmGuessed = new Set();
let hmWrong = 0;
let hmOver = false;
let hmWins = parseInt(localStorage.getItem('hmWins')) || 0;
let hmLosses = parseInt(localStorage.getItem('hmLosses')) || 0;
let hmStreak = parseInt(localStorage.getItem('hmStreak')) || 0;
let hmToastTimeout;

// DOM refs
const hmWordDisplay = document.getElementById('hm-word-display');
const hmKeyboard = document.getElementById('hm-keyboard');
const hmCategoryLabel = document.getElementById('hm-category-label');
const hmHeartsEl = document.getElementById('hm-hearts');
const hmWinsEl = document.getElementById('hm-wins');
const hmLossesEl = document.getElementById('hm-losses');
const hmStreakEl = document.getElementById('hm-streak');
const hmResultOverlay = document.getElementById('hm-result-overlay');
const hmToastEl = document.getElementById('hm-toast');

document.addEventListener('DOMContentLoaded', () => {
  hmNewGame();
  hmUpdateStats();

  // Physical keyboard support
  document.addEventListener('keydown', e => {
    const key = e.key.toUpperCase();
    if (/^[A-Z]$/.test(key) && !hmOver) hmGuessLetter(key);
  });
});

function hmNewGame(){
  const entry = HM_WORDS[Math.floor(Math.random() * HM_WORDS.length)];
  hmWord = entry.word;
  hmCategory = entry.category;
  hmGuessed = new Set();
  hmWrong = 0;
  hmOver = false;

  hmCategoryLabel.textContent = hmCategory;

  // Reset gallows
  HM_BODY_PARTS.forEach(id => {
    const el = document.getElementById(id);
    if(el) el.setAttribute('opacity', '0');
  });

  // Reset hearts
  const hearts = hmHeartsEl.querySelectorAll('.heart');
  hearts.forEach(h => h.classList.remove('lost'));

  // Hide result & reset gift blast
  hmResultOverlay.classList.remove('show');
  const ring = document.getElementById('gift-icon-ring');
  if(ring){ 
    ring.style.opacity = '0'; 
    ring.style.transform = 'scale(0.2)'; 
    ring.classList.remove('game-over-state'); 
  }

  hmBuildKeyboard();
  hmRenderWord();
  hmShowToast("🪢 Guess the word — good luck!", 'warning');
}

function hmBuildKeyboard(){
  hmKeyboard.innerHTML = '';
  'QWERTYUIOPASDFGHJKLZXCVBNM'.split('').forEach(letter => {
    const btn = document.createElement('button');
    btn.className = 'key-btn';
    btn.textContent = letter;
    btn.dataset.letter = letter;
    btn.addEventListener('click', () => hmGuessLetter(letter));
    hmKeyboard.appendChild(btn);
  });
}

function hmGuessLetter(letter){
  if(hmOver || hmGuessed.has(letter)) return;
  hmGuessed.add(letter);

  const btn = hmKeyboard.querySelector(`[data-letter="${letter}"]`);

  if(hmWord.includes(letter)){
    if(btn) btn.classList.add('right');
    hmRenderWord();
    hmCheckWin();
  } else{
    hmWrong++;
    if(btn) btn.classList.add('wrong');
    hmRevealBodyPart(hmWrong - 1);
    hmLoseHeart(hmWrong - 1);
    hmShowToast(`❌ Wrong! ${MAX_WRONG - hmWrong} tries left.`, 'error');
    if(hmWrong >= MAX_WRONG) hmGameOver();
  }

  if(btn) btn.disabled = true;
}

function hmRenderWord(){
  hmWordDisplay.innerHTML = '';
  hmWord.split('').forEach(char => {
    const slot = document.createElement('div');
    slot.className = 'letter-slot';

    const charEl = document.createElement('div');
    charEl.className = 'letter-char';
    if(hmGuessed.has(char)){
      charEl.textContent = char;
      charEl.classList.add('revealed');
    } else{
      charEl.textContent = '';
    }

    const line = document.createElement('div');
    line.className = 'letter-line';

    slot.appendChild(charEl);
    slot.appendChild(line);
    hmWordDisplay.appendChild(slot);
  });
}

function hmRevealBodyPart(index){
  const id = HM_BODY_PARTS[index];
  if(!id) return;
  const el = document.getElementById(id);
  if(el){
    gsap.to(el, { 
      attr: { 
        opacity: 1 
      }, 
      duration: 0.4, 
      ease: 'power2.out' 
    });
  }
}

function hmLoseHeart(index){
  const hearts = hmHeartsEl.querySelectorAll('.heart');
  if(hearts[index]) hearts[index].classList.add('lost');
}

function hmCheckWin(){
  const won = hmWord.split('').every(c => hmGuessed.has(c));
  if(won){
    hmOver = true;
    hmWins++;
    hmStreak++;
    localStorage.setItem('hmWins', hmWins);
    localStorage.setItem('hmStreak', hmStreak);
    hmUpdateStats();

    // Mark correct letters
    hmWordDisplay.querySelectorAll('.letter-char').forEach(el => {
      el.classList.add('correct');
    });

    setTimeout(() => {
      document.getElementById('res-emoji').style.display = 'block';
      triggerGiftBlast(true);
      document.getElementById('res-title').textContent = 'You Won!';
      document.getElementById('res-word-val').textContent = hmWord;
      hmResultOverlay.classList.add('show');
    }, 600);
  }
}

function hmGameOver(){
  hmOver = true;
  hmLosses++;
  hmStreak = 0;
  localStorage.setItem('hmLosses', hmLosses);
  localStorage.setItem('hmStreak', '0');
  hmUpdateStats();

  // Reveal the full word
  hmWord.split('').forEach((char, i) => {
    const slots = hmWordDisplay.querySelectorAll('.letter-slot');
    const charEl = slots[i]?.querySelector('.letter-char');
    if(charEl && !hmGuessed.has(char)){
      charEl.textContent = char;
      charEl.style.color = '#ff5f5f';
      charEl.style.opacity = '1';
      charEl.style.transform = 'translateY(0)';
    }
  });

  // Disable all keys
  hmKeyboard.querySelectorAll('.key-btn').forEach(b => b.disabled = true);

  setTimeout(() => {
    document.getElementById('res-emoji').style.display = 'block';
    triggerGiftBlast(false);
    document.getElementById('res-title').textContent = 'Game Over';
    document.getElementById('res-word-val').textContent = hmWord;
    hmResultOverlay.classList.add('show');
  }, 800);
}

function hmUpdateStats(){
  hmWinsEl.textContent   = hmWins;
  hmLossesEl.textContent = hmLosses;
  hmStreakEl.textContent  = hmStreak;
}

function hmShowToast(text, type = ''){
  hmToastEl.textContent = text;
  hmToastEl.className   = type;
  hmToastEl.classList.add('show');
  clearTimeout(hmToastTimeout);
  hmToastTimeout = setTimeout(() => hmToastEl.classList.remove('show'), 3500);
}

// ===== GIFT BLAST ANIMATION =====
function triggerGiftBlast(isWin){
  const ring = document.getElementById('gift-icon-ring');
  const icon = document.getElementById('gift-icon');
  const canvas = document.getElementById('burst-canvas');
  const ctx = canvas.getContext('2d');

  // Reset state 
  ring.classList.remove('game-over-state');
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  if(!isWin){
    ring.classList.add('game-over-state');
    icon.className = 'bi bi-heartbreak-fill gift-icon';
  } else{
    icon.className = 'bi bi-gift-fill gift-icon';
  }

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  // GSAP: icon ring entrance
  gsap.fromTo(ring, {
    opacity: 0,
    scale: 0.2,
    rotation: -20
  },
  {
    opacity: 1,
    scale: 1,
    rotation: 0,
    duration: 0.55,
    ease: 'back.out(1.8)',
    onComplete: () => {
      // pulse ring after entrance
      gsap.to(ring, {
        scale: 1.12,
        duration: 0.18,
        yoyo: true,
        repeat: 1,
        ease: 'power1.inOut'
      });
    }
  });

  if(!isWin) return;  // no particles on game over, just the icon

  // Canvas particle burst
  const COLORS = ['#1fddbd','#ffd166','#ff5f5f','#a29bfe','#74b9ff','#fd79a8','#55efc4'];
  const SHAPES = ['circle', 'rect', 'triangle'];
  const COUNT = 52;

  const particles = Array.from({length: COUNT}, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 3.5 + Math.random() * 5.5;
    const size = 5 + Math.random() * 7;
    return {
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2, // slight upward bias
      ax: 0,
      ay: 0.13, // gravity
      alpha: 1,
      size,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      spin: (Math.random() - 0.5) * 0.25,
      angle: Math.random() * Math.PI * 2,
      life: 0.7 + Math.random() * 0.3,
    };
  });

  // Also shoot 8 mini gift icons outward via DOM(CSS)
  const wrap = document.getElementById('gift-blast-wrap');
  for(let i = 0; i < 8; i++){
    const mini = document.createElement('i');
    mini.className = 'bi bi-gift-fill';
    mini.style.cssText = `
      position: absolute;
      left: 50%;
      top: 50%;
      font-size: 0.9rem;
      color: ${COLORS[i % COLORS.length]};
      pointer-events: none;
      transform: translate(-50%, -50%);
    `;
    wrap.appendChild(mini);
    const angle = (i / 8) * Math.PI * 2;
    const dist = 55 + Math.random() * 20;
    gsap.to(mini, {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      opacity: 0,
      scale: 0.3,
      duration: 0.7 + Math.random() * 0.3,
      ease: 'power2.out',
      delay: 0.1,
      onComplete: () => mini.remove()
    });
  }

  // RAF loop
  let frame;
  function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    particles.forEach(p => {
      if(p.alpha <= 0) return;
      alive = true;
      p.vx += p.ax;
      p.vy += p.ay;
      p.x += p.vx;
      p.y += p.vy;
      p.angle += p.spin;
      p.alpha -= 0.018 / p.life;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);

      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        ctx.beginPath();
        ctx.moveTo(0, -p.size / 2);
        ctx.lineTo(p.size / 2, p.size / 2);
        ctx.lineTo(-p.size / 2, p.size / 2);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    });

    if(alive) frame = requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // Start particles slightly after icon entrance
  setTimeout(() => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    draw();
  }, 180);
}