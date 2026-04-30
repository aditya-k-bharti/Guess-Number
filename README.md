# 🕹️ BrainArcade

> A collection of brain-teaser games built with vanilla HTML, CSS, JavaScript, Bootstrap 5, and GSAP animations.

 **Live Demo → [adityakbharti-brainarcade.netlify.app](https://adityakbharti-brainarcade.netlify.app)**

 ---
 
## 🎮 Games
 
### 🧠 MindHunt
Guess a secret number before the 60-second timer runs out. Use hints wisely — each clue costs points. Three difficulty levels (Easy / Medium / Hard), a warmth progress bar, guess history, and a local leaderboard.
 
### 🪢  Hangman
Reveal a hidden word letter by letter across 50+ words from 15+ categories. Six lives, physical keyboard support, a live SVG gallows, win/loss streak tracking, and a GSAP-powered gift-burst win animation.
 
---
 
## ✨ Features
 
- 🎨 **Dark arcade aesthetic** — grid background, noise texture, animated scanline
- ⚡ **GSAP animations** — page transitions, card tilt on hover, particle burst on win
- 📱 **Fully responsive** — Bootstrap 5 grid, works on mobile and desktop
- 💾 **Persistent stats** — scores, streaks, wins/losses saved in `localStorage`
- ⌨️ **Keyboard support** — type letters directly in Hangman
- 🔤 **Bootstrap Icons** — used throughout the UI
---

## 🗂️ Project Structure
 
```
BrainArcade/
├── index.html       # Landing page — game selector
├── mindhunt.html    # MindHunt game page
├── hangman.html     # Hangman game page
├── style.css        # Global dark theme + component styles
├── app.js           # GSAP page transitions (shared)
├── mindhunt.js      # MindHunt game logic
└── hangman.js       # Hangman game logic + gift-blast animation
```
 
---
 
## 🛠️ Tech Stack
 
| Technology | Usage |
|---|---|
| HTML5 | Structure |
| CSS3 | Custom dark theme, animations |
| JavaScript (ES6+) | Game logic |
| [Bootstrap 5](https://getbootstrap.com/) | Grid, layout utilities |
| [Bootstrap Icons](https://icons.getbootstrap.com/) | UI icons |
| [GSAP 3](https://gsap.com/) | Page transitions, particle animations |
 
---
 
## 🚀 Run Locally
 
No build tools needed — pure vanilla project.
 
```bash
git clone https://github.com/aditya-k-bharti/BrainArcade.git
cd BrainArcade
```
 
Then just open `index.html` in your browser, or use a local server:
 
```bash
# With VS Code → Live Server extension (recommended)
# OR with Python
python -m http.server 8000
```

---
 
## 📸 Pages
 
| Page | Description |
|---|---|
| `index.html` | Home screen with animated game cards |
| `mindhunt.html` | Number guessing game |
| `hangman.html` | Word guessing game |
 
---
 
## 🙌 Author
 
**Aditya Kumar Bharti**
 
[![GitHub](https://img.shields.io/badge/GitHub-aditya--k--bharti-181717?style=flat&logo=github)](https://github.com/aditya-k-bharti)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-aditya--kumar--bharti-0077B5?style=flat&logo=linkedin)](https://linkedin.com/in/aditya-kumar-bharti-dev-6214b6354)
 
---
 
## 📄 License
 
MIT License — feel free to fork, modify, and use.
 
