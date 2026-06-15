// ====== ZIP GAME LOGIC ======

const ZIP_PUZZLES = [
  // 1 — 4×4 easy, no walls
  {
    id:1, rows:4, cols:4,
    dots: [
      {r:0, c:0, n:1}, {r:0, c:3, n:2}, 
      {r:3, c:3, n:3}, {r:3, c:0, n:4}
    ],
    walls: [],
    solution: [
      [0,0],[1,0],[2,0],[2,1],
      [1,1],[0,1],[0,2],[0,3],
      [1,3],[1,2],[2,2],[2,3],
      [3,3],[3,2],[3,1],[3,0]
    ]
  },
  // 2 — 4×4 5 dots
  {
    id:2, rows:4, cols:4,
    dots:[
      {r:0, c:0, n:1}, {r:0, c:3, n:2}, 
      {r:3, c:0, n:3}, 
      {r:2, c:2, n:4}, {r:2, c:3, n:5}
    ],
    walls:[],
    solution:[
      [0,0],[0,1],[0,2],[0,3],
      [1,3],[1,2],[1,1],[1,0],
      [2,0],[3,0],[3,1],[2,1],
      [2,2],[3,2],[3,3],[2,3]
    ]
  },
  //3 — 5×5 easy, 
  {
    id:3, rows:5, cols:5,
    dots:[
      {r:0, c:0, n:1}, {r:0, c:4, n:2}, 
      {r:2, c:2, n:3}, {r:4, c:4, n:4}, 
      {r:4, c:0, n:5}
    ],
    walls:[],
    solution:[
      [0,0],[0,1],[0,2],[0,3],[0,4],
      [1,4],[1,3],[1,2],[1,1],[1,0],
      [2,0],[2,1],[2,2],[2,3],[2,4],
      [3,4],[4,4],[4,3],[3,3],[3,2],
      [4,2],[4,1],[3,1],[3,0],[4,0],
    ]
  },
  // 4 — 5×5 with walls
  {
    id:4, rows:5, cols:5,
    dots:[
      {r:0, c:0, n:1}, {r:2, c:0, n:2}, 
      {r:2, c:4, n:3}, {r:4, c:4, n:4}, 
      {r:4, c:0, n:5}
    ],
    walls:[
      {r:1, c:1, side:'right'}, 
      {r:1, c:2, side:'right'}
    ],
    solution:[
      [0,0],[1,0],[2,0],[2,1],[1,1],
      [0,1],[0,2],[1,2],[2,2],[2,3],
      [1,3],[0,3],[0,4],[1,4],[2,4],
      [3,4],[4,4],[4,3],[3,3],[3,2],
      [4,2],[4,1],[3,1],[3,0],[4,0]
    ]
  },
  // 5 — 5×5, spiral feel
  {
    id:5, rows:5, cols:5,
    dots:[
      {r:0,c:0,n:1},{r:0,c:4,n:2},
      {r:4,c:4,n:3},{r:4,c:0,n:4},
      {r:2,c:2,n:5}
    ],
    walls:[],
    solution:[
      [0,0],[0,1],[0,2],[0,3],[0,4],
      [1,4],[1,3],[2,3],[2,4],[3,4],
      [4,4],[4,3],[3,3],[3,2],[4,2],
      [4,1],[4,0],[3,0],[3,1],[2,1],
      [2,0],[1,0],[1,1],[1,2],[2,2]
    ]
  },
  // 6 — 5×5 with walls, tricker
  {
    id:6, rows:5, cols:5,
    dots:[
      {r:0,c:2,n:1},{r:2,c:4,n:2},{r:4,c:2,n:3},
      {r:2,c:0,n:4},{r:1,c:3,n:5}
    ],
    walls:[
      {r:0,c:1,side:'right'},{r:1,c:3,side:'right'},{r:1,c:3,side:'bottom'},{r:3,c:1,side:'right'},{r:3,c:1,side:'bottom'},{r:2,c:3,side:'right'},{r:1,c:0,side:'right'}
    ],
    solution:[
      [0,2],[0,3],[0,4],[1,4],[2,4],
      [3,4],[4,4],[4,3],[3,3],[2,3],
      [2,2],[3,2],[4,2],[4,1],[4,0],
      [3,0],[3,1],[2,1],[2,0],[1,0],
      [0,0],[0,1],[1,1],[1,2],[1,3]
    ]
  },
  // 7 — 6×6 medium
  {
    id:7, rows:6, cols:6,
    dots:[
      {r:0,c:0,n:1},{r:0,c:5,n:2},{r:3,c:5,n:3},
      {r:3,c:0,n:4},{r:5,c:0,n:5},{r:4,c:5,n:6}
    ],
    walls:[],
    solution:[
      [0,0],[0,1],[0,2],[0,3],[0,4],[0,5],
      [1,5],[2,5],[3,5],[3,4],[2,4],[1,4],
      [1,3],[2,3],[3,3],[3,2],[2,2],[2,1],
      [1,1],[1,0],[2,0],[2,1],[3,1],[3,0],
      [4,0],[5,0],[5,1],[4,1],[4,2],[5,2],
      [5,3],[4,3],[4,4],[5,4],[5,5],[4,5]
    ]
  },
  // 8 — 6×6 with walls
  {
    id:8, rows:6, cols:6,
    dots:[
      {r:0,c:0,n:1},{r:0,c:3,n:2},{r:0,c:5,n:3},
      {r:5,c:5,n:4},{r:5,c:2,n:5},{r:5,c:0,n:6}
    ],
    walls:[
      {r:2,c:2,side:'right'},{r:3,c:3,side:'bottom'},{r:1,c:4,side:'bottom'}
    ],
    solution:[
      [0,0],[0,1],[0,2],[0,3],[0,4],[0,5],
      [1,5],[1,4],[1,3],[2,3],[2,4],[2,5],
      [3,5],[3,4],[3,3],[3,2],[4,2],[4,3],
      [4,4],[4,5],[5,5],[5,4],[5,3],[5,2],
      [5,1],[4,1],[3,1],[2,1],[2,2],[1,2],
      [1,1],[1,0],[2,0],[3,0],[4,0],[5,0]
    ]
  },
  // 9 — 6×6 harder
  {
    id:9, rows:6, cols:6,
    dots:[
      {r:0,c:2,n:1},{r:1,c:4,n:2},{r:4,c:4,n:3},
      {r:4,c:1,n:4},{r:0,c:0,n:5},{r:4,c:5,n:6}
    ],
    walls:[
      {r:2,c:0,side:'right'},{r:3,c:5,side:'bottom'}
    ],
    solution:[
      [0,2],[0,3],[0,4],[0,5],[1,5],[1,4],
      [1,3],[2,3],[2,4],[2,5],[3,5],[3,4],
      [4,4],[4,3],[3,3],[3,2],[4,2],[4,1],
      [3,1],[2,1],[2,2],[1,2],[1,1],[0,1],
      [0,0],[1,0],[2,0],[3,0],[4,0],[5,0],
      [5,1],[5,2],[5,3],[5,4],[5,5],[4,5]
    ]
  },
  // 10 — 6×6 expert
  {
    id:10, rows:6, cols:6,
    dots:[
      {r:0,c:0,n:1},{r:0,c:2,n:2},{r:0,c:5,n:3},
      {r:5,c:5,n:4},{r:5,c:3,n:5},{r:5,c:0,n:6},
      {r:3,c:4,n:7}
    ],
    walls:[
      {r:1,c:1,side:'right'},{r:2,c:4,side:'bottom'},{r:4,c:2,side:'right'}
    ],
    solution:[
      [0,0],[0,1],[0,2],[0,3],[0,4],[0,5],
      [1,5],[1,4],[1,3],[1,2],[2,2],[2,3],
      [2,4],[2,5],[3,5],[4,5],[5,5],[5,4],
      [5,3],[5,2],[5,1],[5,0],[4,0],[3,0],
      [2,0],[1,0],[1,1],[2,1],[3,1],[4,1],
      [4,2],[3,2],[3,3],[4,3],[4,4],[3,4]
    ]
  },
  // 11 — 4×4 row-serpentine
  {
    id:11, rows:4, cols:4,
    dots:[
      {r:0, c:0, n:1}, {r:0, c:3, n:2}, 
      {r:3, c:3, n:3}, {r:3, c:0, n:4}
    ],
    walls:[
      {r:0,c:0,side:'right'},{r:0,c:2,side:'bottom'},{r:1,c:3,side:'bottom'},{r:2,c:1,side:'right'},{r:3,c:0, side:'right'}
    ],
    solution:[
      [0,0],[1,0],[1,1],[0,1],
      [0,2],[0,3],[1,3],[1,2],
      [2,2],[2,3],[3,3],[3,2],
      [3,1],[2,1],[2,0],[3,0]
    ]
  },
  // 12 — 4×4
  {
    id:12, rows:4, cols:4,
    dots:[
      {r:0, c:0, n:1}, {r:0, c:3, n:2}, 
      {r:3, c:3, n:3}, 
      {r:3, c:0, n:4}, {r:2, c:1, n:5}
    ],
    walls:[
      {r:0,c:0,side:'right'},{r:0,c:2,side:'bottom'},{r:1,c:0,side:'bottom'},{r:1,c:3,side:'bottom'},{r:2,c:1, side:'right'}
    ],
    solution:[
      [0,0],[1,0],[1,1],[0,1],
      [0,2],[0,3],[1,3],[1,2],
      [2,2],[2,3],[3,3],[3,2],
      [3,1],[3,0],[2,0],[2,1]
    ]
  },
  // 13 — 5×5
  {
    id:13, rows:5, cols:5,
    dots:[
      {r:0, c:0, n:1}, {r:4, c:0, n:2}, 
      {r:0, c:2, n:3}, {r:0, c:4, n:4},
      {r:4, c:4, n:5}
    ],
    walls:[
      {r:0,c:0,side:'bottom'},{r:1,c:1,side:'right'},{r:3,c:0,side:'right'},{r:4,c:1,side:'right'},
      {r:1,c:4,side:'bottom'},{r:2,c:3,side:'bottom'}
    ],
    solution:[
      [0,0],[0,1],[1,1],[1,0],[2,0],
      [3,0],[4,0],[4,1],[3,1],[2,1],
      [2,2],[1,2],[0,2],[0,3],[0,4],
      [1,4],[1,3],[2,3],[2,4],[3,4],
      [3,3],[3,2],[4,2],[4,3],[4,4]
    ]
  },
  // 14 — 5×5
  {
    id:14, rows:5, cols:5,
    dots:[
      {r:0, c:0, n:1}, {r:0, c:4, n:2}, 
      {r:2, c:0, n:3}, {r:4, c:0, n:4},
      {r:4, c:4, n:5}
    ],
    walls:[
      {r:0,c:0,side:'right'},{r:0,c:3,side:'bottom'},{r:1,c:4,side:'bottom'},{r:4,c:1,side:'right'},
      {r:1,c:1,side:'bottom'},{r:3,c:2,side:'right'}
    ],
    solution:[
      [0,0],[1,0],[1,1],[0,1],[0,2],
      [0,3],[0,4],[1,4],[1,3],[1,2],
      [2,2],[2,1],[2,0],[3,0],[4,0],
      [4,1],[3,1],[3,2],[4,2],[4,3],
      [3,3],[2,3],[2,4],[3,4],[4,4]
    ]
  },
  // 15 — 5×5
  {
    id:15, rows:5, cols:5,
    dots:[
      {r:0, c:0, n:1}, {r:0, c:4, n:2}, 
      {r:4, c:4, n:3}, {r:4, c:0, n:4},
      {r:1, c:1, n:5}, {r:2, c:2, n:6}
    ],
    walls:[
      {r:0,c:0,side:'bottom'},{r:1,c:4,side:'bottom'},{r:1,c:2,side:'right'},{r:2,c:3,side:'bottom'},
      {r:4,c:2,side:'right'}
    ],
    solution:[
      [0,0],[0,1],[0,2],[0,3],[0,4],
      [1,4],[1,3],[2,3],[2,4],[3,4],
      [4,4],[4,3],[3,3],[3,2],[4,2],
      [4,1],[4,0],[3,0],[3,1],[2,1],
      [2,0],[1,0],[1,1],[1,2],[2,2]
    ]
  },
  // 16 — 5×5
  {
    id:16, rows:5, cols:5,
    dots:[
      {r:0, c:0, n:1}, {r:0, c:4, n:2}, 
      {r:4, c:0, n:3}, {r:4, c:1, n:4},
      {r:2, c:4, n:5}
    ],
    walls:[
      {r:0,c:2,side:'bottom'},{r:1,c:1,side:'bottom'},{r:3,c:1,side:'bottom'},{r:2,c:3,side:'bottom'}
    ],
    solution:[
      [0,0],[0,1],[0,2],[0,3],[0,4],
      [1,4],[1,3],[2,3],[2,2],[1,2],
      [1,1],[1,0],[2,0],[2,1],[3,1],
      [3,0],[4,0],[4,1],[4,2],[3,2],
      [3,3],[4,3],[4,4],[3,4],[2,4]
    ]
  },
  // 17 — 6×6
  {
    id:17, rows:6, cols:6,
    dots:[
      {r:0, c:0, n:1}, {r:0, c:5, n:2}, 
      {r:2, c:5, n:3}, {r:3, c:5, n:4},
      {r:5, c:5, n:5}, {r:5, c:0, n:6}
    ],
    walls:[
      {r:0,c:2,side:'bottom'},{r:0,c:3,side:'bottom'},{r:1,c:1,side:'bottom'},{r:2,c:0,side:'right'},
      {r:3,c:0,side:'right'},{r:3,c:1,side:'bottom'},
      {r:4,c:4,side:'right'},{r:4,c:2,side:'bottom'},
      {r:4,c:3,side:'bottom'}
    ],
    solution:[
      [0,0],[0,1],[0,2],[0,3],[0,4],[0,5],
      [1,5],[1,4],[1,3],[1,2],[1,1],[1,0],
      [2,0],[3,0],[4,0],[4,1],[4,2],[4,3],
      [4,4],[3,4],[3,3],[3,2],[3,1],[2,1],
      [2,2],[2,3],[2,4],[2,5],[3,5],[4,5],
      [5,5],[5,4],[5,3],[5,2],[5,1],[5,0]
    ]
  },
  // 18 — 6×6
  {
    id:18, rows:6, cols:6,
    dots:[
      {r:0, c:0, n:1}, {r:5, c:0, n:2}, 
      {r:0, c:2, n:3}, {r:5, c:2, n:4},
      {r:0, c:4, n:5}, {r:0, c:5, n:6}
    ],
    walls:[
      {r:0,c:0,side:'bottom'},{r:1,c:1,side:'right'},
      {r:3,c:3,side:'right'},{r:5,c:3,side:'right'},
    ],
    solution:[
      [0,0],[0,1],[1,1],[1,0],[2,0],[3,0],
      [4,0],[5,0],[5,1],[4,1],[3,1],[2,1],
      [2,2],[1,2],[0,2],[0,3],[1,3],[2,3],
      [3,3],[3,2],[4,2],[5,2],[5,3],[4,3],
      [4,4],[5,4],[5,5],[4,5],[3,5],[3,4],
      [2,4],[2,5],[1,5],[1,4],[0,4],[0,5]
    ]
  },
  // 19 — 6×6
  {
    id:19, rows:6, cols:6,
    dots:[
      {r:0, c:0, n:1}, {r:0, c:5, n:2}, 
      {r:5, c:5, n:3}, {r:5, c:0, n:4},
      {r:1, c:1, n:5}, {r:3, c:2, n:6}
    ],
    walls:[
      {r:1,c:5,side:'bottom'},{r:1,c:3,side:'right'},
      {r:4,c:3,side:'right'},{r:5,c:2,side:'right'},
      {r:4,c:1,side:'right'},{r:2,c:0,side:'right'},
      {r:2,c:2,side:'bottom'}
    ],
    solution:[
      [0,0],[0,1],[0,2],[0,3],[0,4],[0,5],
      [1,5],[1,4],[2,4],[2,5],[3,5],[3,4],
      [4,4],[4,5],[5,5],[5,4],[5,3],[4,3],
      [4,2],[5,2],[5,1],[5,0],[4,0],[4,1],
      [3,1],[3,0],[2,0],[1,0],[1,1],[2,1],
      [2,2],[1,2],[1,3],[2,3],[3,3],[3,2]
    ]
  },
  // 20 — 6×6
  {
    id:20, rows:6, cols:6,
    dots:[
      {r:0, c:0, n:1}, {r:0, c:5, n:2}, 
      {r:1, c:0, n:3}, {r:2, c:0, n:4},
      {r:2, c:5, n:5}, {r:3, c:0, n:6}, 
      {r:5, c:0, n:7}
    ],
    walls:[
      {r:0,c:2,side:'bottom'},{r:1,c:3,side:'bottom'},
      {r:3,c:3,side:'right'},{r:4,c:3,side:'right'},
      {r:4,c:4,side:'bottom'},{r:3,c:1,side:'right'},
      {r:5,c:0,side:'right'}
    ],
    solution:[
      [0,0],[0,1],[0,2],[0,3],[0,4],[0,5],
      [1,5],[1,4],[1,3],[1,2],[1,1],[1,0],
      [2,0],[2,1],[2,2],[2,3],[2,4],[2,5],
      [3,5],[3,4],[4,4],[4,5],[5,5],[5,4],
      [5,3],[4,3],[3,3],[3,2],[4,2],[5,2],
      [5,1],[4,1],[3,1],[3,0],[4,0],[5,0]
    ]
  }
];

// ──────────────── State ────────────────────────────
const CELL = 60; // per cell size in pixels
const ZIP_COLORS = [
  '#a29bfe','#1fddbd','#ff5f5f','#ffd166',
  '#74b9ff','#fd79a8','#55efc4','#fdcb6e',
  '#e17055','#6c5ce7','#00b894','#e84393',
  '#06d6a0','#38ef7d','#2ecc71','#ff4d8d',
  '#c77dff','#48cae4','#ff6b6b','#f9c74f'
];

let zPuzzle = ZIP_PUZZLES[0];
let zPath = [];
let zDrawing = false;
let zMoves = 0;
let zSolvedSet = new Set(JSON.parse(localStorage.getItem('zipSolved') || '[]'));
let zToastTimeout;
let zHintStep = 0;

const zCanvas = document.getElementById('zip-canvas');
const zCtx = zCanvas.getContext('2d');
const zWrap = document.getElementById('zip-grid-wrap');
const zStatus = document.getElementById('zip-status');
const zMovesEl = document.getElementById('zip-moves');
const zSolvedEl = document.getElementById('zip-solved');
const zPuzzleCountEl = document.getElementById('zip-puzzle-count');
const zToast = document.getElementById('zip-toast');

// ──────────────── Initialization ────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildPuzzleSelect();
  loadPuzzle(ZIP_PUZZLES[0]);
  zSolvedEl.textContent = zSolvedSet.size;

  // Mouse events
  zCanvas.addEventListener('mousedown', onZipStart);
  zCanvas.addEventListener('mousemove', onZipMove);
  zCanvas.addEventListener('mouseup', onZipEnd);
  zCanvas.addEventListener('mouseleave', onZipEnd);

  // Touch events
  zCanvas.addEventListener('touchstart', e => {
    e.preventDefault();
    onZipStart(e.touches[0]);
  }, {passive:false});
  zCanvas.addEventListener('touchmove', e => {
    e.preventDefault();
    onZipMove(e.touches[0]);
  }, {passive:false});
  zCanvas.addEventListener('touchend', e => {
    e.preventDefault();
    onZipEnd();
  }, {passive:false});
});

function buildPuzzleSelect(){
  const sel = document.getElementById('zip-puzzle-select');
  sel.innerHTML = '';
  ZIP_PUZZLES.forEach(p => {
    const btn = document.createElement('button');
    btn.className = 'zip-puzzle-btn' + (p.id === zPuzzle.id ? ' active': '') + (zSolvedSet.has(p.id) ? ' solved': '');
    btn.textContent = p.id;
    btn.title = `Puzzle ${p.id} — ${p.rows}×${p.cols}`;
    btn.onclick = () => loadPuzzle(p);
    sel.appendChild(btn);
  });
}

function loadPuzzle(p){
  zPuzzle = p;
  zPath = [];
  zMoves = 0;
  zHintStep = 0;
  zDrawing = false;
  zMovesEl.textContent = 0;
  zPuzzleCountEl.textContent = p.id;

  const w = p.cols * CELL;
  const h = p.rows * CELL;
  zCanvas.width = w;
  zCanvas.height = h;
  zWrap.style.width = w + 'px';
  zWrap.style.height = h + 'px';

  zStatus.textContent = 'Draw a path from dot 1';
  zStatus.style.color = 'var(--text-muted)';

  buildPuzzleSelect();
  drawZip();
  zipShowToast(`Puzzle ${p.id} — ${p.rows}×${p.cols} grid`, '');
}

// ── Draw ─────────────────────────────────────────────────────────────────────
function drawZip(){
  const p = zPuzzle;
  zCtx.clearRect(0, 0, zCanvas.width, zCanvas.height);

  //Grid lines
  zCtx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
  zCtx.lineWidth = 1;
  for(let r = 0; r <= p.rows; r++){
    zCtx.beginPath();
    zCtx.moveTo(0, r*CELL);
    zCtx.lineTo(p.cols*CELL, r*CELL);
    zCtx.stroke();
  }
  for(let c = 0; c <= p.cols; c++){
    zCtx.beginPath();
    zCtx.moveTo(c*CELL, 0);
    zCtx.lineTo(c*CELL, p.rows*CELL);
    zCtx.stroke();
  }

  // Walls
  zCtx.strokeStyle = '#a29bfe';
  zCtx.lineWidth = 5;
  zCtx.lineCap = 'round';
  p.walls.forEach(w => {
    zCtx.beginPath();
    if(w.side === 'right'){
      zCtx.moveTo((w.c+1)*CELL, w.r*CELL+4);
      zCtx.lineTo((w.c+1)*CELL, (w.r+1)*CELL-4);
    } else{
      zCtx.moveTo(w.c*CELL+4, (w.r+1)*CELL);
      zCtx.lineTo((w.c+1)*CELL-4, (w.r+1)*CELL);
    }
    zCtx.stroke();
  });

  // Path
  if(zPath.length > 1){
    zCtx.strokeStyle = 'rgba(162, 155, 154, 0.55)';
    zCtx.lineWidth = CELL * 0.45;
    zCtx.lineCap = 'round';
    zCtx.lineJoin = 'round';
    zCtx.beginPath();
    zCtx.moveTo(zPath[0][1]*CELL + CELL/2, zPath[0][0]*CELL + CELL/2);
    zPath.slice(1).forEach(([r,c]) => zCtx.lineTo(c*CELL+CELL/2, r*CELL+CELL/2));
    zCtx.stroke();
  }

  //Visited cells highlight
  zPath.forEach(([r,c]) => {
    zCtx.fillStyle = 'rgba(162,155,254,0.08)';
    zCtx.fillRect(c*CELL+1, r*CELL+1, CELL-2, CELL-2);
  });

  //Dots
  p.dots.forEach((d, i) =>{
    const x = d.c*CELL + CELL/2;
    const y = d.r*CELL + CELL/2;
    const visited = zPath.some(([pr,pc]) => pr === d.r && pc === d.c);

    zCtx.beginPath();
    zCtx.arc(x, y, CELL*0.28, 0, Math.PI*2);
    zCtx.fillStyle = visited ? ZIP_COLORS[i % ZIP_COLORS.length] : 'var(--bg-card2)';
    zCtx.fill();
    zCtx.strokeStyle = ZIP_COLORS[i % ZIP_COLORS.length];
    zCtx.lineWidth = 2.5;
    zCtx.stroke();

    zCtx.fillStyle = visited ? '#0a0b0f' : ZIP_COLORS[i % ZIP_COLORS.length];
    zCtx.font = `bold ${CELL * 0.26}px Syne, sans-serif`;
    zCtx.textAlign = 'center';
    zCtx.textBaseline = 'middle';
    zCtx.fillText(d.n, x, y);
  });
}

// ── Interaction ───────────────────────────────────────────────────────────────
function cellFromEvent(e){
  const rect = zCanvas.getBoundingClientRect();
  const x = (e.clientX || e.pageX) - rect.left;
  const y = (e.clientY || e.pageY) - rect.top;
  const c = Math.floor(x / CELL);
  const r = Math.floor(y / CELL);
  if(r < 0 || r >= zPuzzle.rows || c < 0 || c >= zPuzzle.cols) return null;
  return [r, c];
}

function isFirstDot(r, c){
  const d = zPuzzle.dots.find(d => d.n === 1);
  return d && d.r === r && d.c === c;
}

function wallBetween(r1,c1,r2,c2){
  const walls = zPuzzle.walls;
  if(r1 === r2){
    const minC = Math.min(c1,c2);
    return walls.some(w => w.r === r1 && w.c === minC && w.side === 'right');
  } else{
    const minR = Math.min(r1,r2);
    return walls.some(w => w.r === minR && w.c === c1 && w.side === 'bottom');
  }
}

function isAdjacent(a, b){
  const dr = Math.abs(a[0]-b[0]);
  const dc = Math.abs(a[1]-b[1]);
  return (dr+dc === 1) && !wallBetween(a[0],a[1],b[0],b[1]);
}

function inPath(r,c){
  return zPath.some(([pr,pc]) => pr === r && pc === c);
}

function onZipStart(e){
  const cell = cellFromEvent(e);
  if(!cell) return;
  const [r,c] = cell;
  if(!isFirstDot(r,c)){
    zipShowToast('Start from dot 1!','error');
    return
  }
  zDrawing = true;
  zPath = [[r,c]];
  zMoves = 0;
  zMovesEl.textContent = 0;
  zStatus.textContent = 'Keep going...';
  zStatus.style.color = '#a29bfe';
  drawZip();
}

function onZipMove(e){
  if(!zDrawing) return;
  const cell = cellFromEvent(e);
  if(!cell) return;
  const [r,c] = cell;

  //If going back -- undo last step
  if(zPath.length >= 2){
    const prev = zPath[zPath.length-2];
    if (prev[0]===r && prev[1]===c) {
      zPath.pop();
      zMoves = Math.max(0, zMoves-1);
      zMovesEl.textContent = zMoves;
      drawZip();
      return;
    }
  }

  const last = zPath[zPath.length-1];
  if(last[0]===r && last[1]===c) return;
  if(!isAdjacent(last, [r,c])) return;
  if(inPath(r,c)) return;

  //Dott order check -- can't skip a dot
  const nextDotNum = zPath.filter(([pr,pc]) => 
  zPuzzle.dots.some(d => d.r === pr && d.c === pc)).length + 1;
  const cellDot = zPuzzle.dots.find(d => d.r === r && d.c === c);
  if(cellDot && cellDot.n !== nextDotNum) return;

  zPath.push(([r,c]));
  zMoves++;
  zMovesEl.textContent = zMoves;
  drawZip();
}

function onZipEnd(){
  if(!zDrawing) return
  zDrawing = false;
  checkZipWin();
}

function checkZipWin(){
  const total = zPuzzle.rows * zPuzzle.cols;
  if(zPath.length !== total) return;

  //Check last cell is last dot
  const last = zPath[zPath.length-1];
  const lastDot = zPuzzle.dots.find(d => d.n === zPuzzle.dots.length);
  if(!lastDot || lastDot.r !== last[0] || lastDot.c !== last[1]) return;
  
  //Solved!
  zSolvedSet.add(zPuzzle.id);
  localStorage.setItem('zipSolved', JSON.stringify([...zSolvedSet]));
  zSolvedEl.textContent = zSolvedSet.size;
  buildPuzzleSelect();

  zStatus.textContent = `🎉 Solved in ${zMoves} moves!`;
  zStatus.style.color = 'var(--teal)';
  zipShowToast(`⚡ Puzzle ${zPuzzle.id} solved! ${zMoves} moves`, 'success');

  //Celebration flash on path
  gsap.to(zWrap, {
    boxShadow: '0 0 40px rgba(162, 155, 254, 0.6)',
    duration: 0.4,
    yoyo: true,
    repeat:3
  });
}

// ── Controls ─────────────────────────────────────────────────────────────────
function zipUndo(){
  if(zPath.length <= 1) return;
  zPath.pop();
  zMoves = Math.max(0, zMoves-1);
  zMovesEl.textContent = zMoves;
  drawZip();
}

function zipReset(){
  zPath = [];
  zMoves = 0;
  zDrawing = false;
  zMovesEl.textContent = 0;
  zStatus.textContent = 'Draw a path from dot 1';
  zStatus.style.color = 'var(--text-muted)';
  drawZip();
}

function zipHint(){
  const sol = zPuzzle.solution;
  if(!sol || sol.length === 0){
    zipShowToast('No solution hint available for this puzzle', 'warning');
    return;
  }

  //Find how far our path matches solution
  let matchLen = 0;
  for(let i = 0; i < Math.min(zPath.length, sol.length); i++){
    if(zPath[i][0] === sol[i][0] && zPath[i][1] === sol[i][1]) matchLen = i+1;
    else break;
  }

  if(matchLen < zPath.length){
    zipShowToast('Your path diverged from solution ─ resetting to last correct step', 'warning');
    zPath = sol.slice(0, matchLen);
    zMoves = zPath.length - 1;
    zMovesEl.textContent = zMoves;
    drawZip();
    return;
  }

  if(matchLen === sol.length){
    zipShowToast('Already solved!', 'success');
    return;
  }

  const next = sol[matchLen];
  //Highlight hint cell
  zCtx.fillStyle = 'rgba(253, 203, 110, 0.45)';
  zCtx.fillRect(next[1]*CELL+4, next[0]*CELL+4, CELL-8, CELL-8);
  zipShowToast(`Hint: Move the next cell`, 'warning');
}

// ── Toast ────────────────────────────────────────────────────────────────────
function zipShowToast(text, type=''){
  zToast.textContent = text;
  zToast.className = type;
  zToast.classList.add('show');
  clearTimeout(zToastTimeout);
  zToastTimeout = setTimeout(() => zToast.classList.remove('show'), 3500);
}