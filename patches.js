// ====== PATCHES GAME LOGIC ======

const PT_CELL = 64; //px

const PT_PALETTE = [
  '#a29bfe','#1fddbd','#ff5f5f','#ffd166',
  '#74b9ff','#fd79a8','#55efc4','#fdcb6e',
  '#e17055','#6c5ce7','#00b894','#e84393',
  '#06d6a0','#38ef7d','#2ecc71','#ff4d8d',
  '#c77dff','#48cae4','#ff6b6b','#f9c74f'
]

// Define puzzles via cell grids — grid[r][c] = patch index
function buildPuzzle(id, grid, shapes) {
  const rows = grid.length;
  const cols = grid[0].length;

  // Collect patches
  const patchMap = {}; // index -> cells[]
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const idx = grid[r][c];
      if (!patchMap[idx]) patchMap[idx] = [];
      patchMap[idx].push([r,c]);
    }

  const patches = Object.entries(patchMap).map(([idxStr, cells]) => {
    const idx = parseInt(idxStr);
    const rs = cells.map(([r])=>r);
    const cs = cells.map(([,c])=>c);
    const r1 = Math.min(...rs), r2 = Math.max(...rs);
    const c1 = Math.min(...cs), c2 = Math.max(...cs);
    const num = cells.length;
    const shape = shapes[idx] || 'any';
    // Place clue at the middle-ish cell
    const mid = cells[Math.floor(cells.length/2)];
    return { idx, r1, c1, r2, c2, num, shape, color: PT_PALETTE[idx % PT_PALETTE.length], clueR: mid[0], clueC: mid[1] };
  });

  return { id, rows, cols, grid, patches };
}

const ALL_PATCHES_PUZZLES = [
  // 1 — 4×4
  buildPuzzle(1,
    [[0,0,0,0],
     [1,1,2,2],
     [1,1,2,2],
     [3,3,3,3]],
    {0:'wide',1:'square',2:'square',3:'wide'}
  ),
  // 2 — 4×5
  buildPuzzle(2,
    [[0,0,0,0,3],
     [2,2,1,1,3],
     [2,2,1,1,3],
     [4,4,4,4,4]],
    {0:'wide',1:'square',2:'square',3:'tall',4:'wide'}
  ),
  // 3 — 5×5
  buildPuzzle(3,
    [[0,0,0,1,4],
     [0,0,0,1,4],
     [3,2,2,1,4],
     [3,2,2,1,4],
     [5,5,5,1,4]],
    {0:'any',1:'tall',2:'square',3:'tall',4:'any',5:'wide'}
  ),
  // 4 — 5×5
  buildPuzzle(4,
    [[0,0,2,2,1],
     [0,0,2,2,1],
     [3,3,7,7,1],
     [3,3,5,5,1],
     [6,6,4,4,4]],
    {0:'square',1:'tall',2:'square',3:'square',4:'any',5:'wide',6:'wide',7:'wide'}
  ),
  // 5 — 5×5
  buildPuzzle(5,
    [[0,0,0,0,0],
     [1,1,5,2,2],
     [1,1,5,2,2],
     [4,4,4,3,3],
     [4,4,4,3,3]],
    {0:'wide',1:'square',2:'any',3:'square',4:'any',5:'tall'}
  ),
  // 6 — 5×6
  buildPuzzle(6,
    [[0,0,0,7,2,1],
     [0,0,0,7,2,1],
     [3,3,4,4,2,1],
     [3,3,4,4,5,1],
     [6,6,6,6,5,1]],
    {0:'any',1:'tall',2:'tall',3:'square',4:'square',5:'tall',6:'wide',7:'tall'}
  ),
  // 7 — 6×6
  buildPuzzle(7,
    [[0,0,0,1,1,1],
     [0,0,0,1,1,1],
     [5,5,3,3,6,6],
     [5,5,3,3,6,6],
     [5,5,2,2,6,6],
     [7,7,2,2,4,4]],
    {0:'any',1:'any',2:'square',3:'square',4:'wide',5:'any',6:'any',7:'wide'}
  ),
  // 8 — 6×6
  buildPuzzle(8,
    [[0,0,1,1,1,5],
     [0,0,1,1,1,5],
     [3,3,4,4,2,5],
     [3,3,4,4,2,5],
     [6,6,7,7,2,5],
     [6,6,7,7,8,8]],
    {0:'square',1:'any',2:'tall',3:'square',4:'square',5:'tall',6:'square',7:'square',8:'wide'}
  ),
  // 9 — 6×6
  buildPuzzle(9,
    [[0,0,0,9,1,1],
     [2,2,3,9,1,1],
     [2,2,3,4,4,4],
     [5,5,3,4,4,4],
     [5,5,6,6,7,7],
     [8,8,6,6,7,7]],
    {0:'any',1:'square',2:'square',3:'tall',4:'any',5:'square',6:'square',7:'square',8:'wide',9:'tall'}
  ),
  // 10 — 6×6 hard
  buildPuzzle(10,
    [[0,0,1,1,2,2],
     [0,0,1,1,2,2],
     [3,4,4,7,6,6],
     [3,4,4,7,6,6],
     [3,9,5,5,5,5],
     [3,9,8,8,8,8]],
    {0:'square',1:'square',2:'square',3:'tall',4:'square',5:'wide',6:'any',7:'tall',8:'any',9:'tall'}
  ),
  // 11 - 4x4 
  buildPuzzle(11,
    [[0,0,0,0],
     [1,2,2,3],
     [1,2,2,3],
     [1,4,4,3]],
    {0:'wide',1:'tall',2:'square',3:'tall',4:'wide'}
  ),
  // 12 - 5x4 
  buildPuzzle(12,
    [[0,0,1,1],
     [0,0,1,1],
     [4,4,4,4],
     [2,2,3,3],
     [2,2,3,3]],
    {0:'square',1:'square',2:'square',3:'square',4:'wide'}
  ),
  // 13 - 5x5 
  buildPuzzle(13,
    [[0,0,0,1,1],
     [0,0,0,1,1],
     [2,2,5,3,3],
     [2,2,5,4,4],
     [2,2,5,4,4]],
    {0:'wide',1:'square',2:'tall',3:'wide',4:'square',5:'tall'}
  ),
  // 14 - 5x5 
  buildPuzzle(14,
    [[0,0,1,1,1],
     [0,0,1,1,1],
     [2,2,3,3,4],
     [2,2,3,3,4],
     [5,5,5,6,6]],
    {0:'square',1:'wide',2:'square',3:'square',4:'tall',5:'wide',6:'wide'}
  ),
  // 15 - 5x5 
  buildPuzzle(15,
    [[1,1,2,2,2],
     [1,1,2,2,2],
     [0,0,0,0,0],
     [3,3,4,4,5],
     [3,3,4,4,5]],
    {0:'wide',1:'square',2:'wide',3:'square',4:'square',5:'tall'}
  ),
  // 16 - 5x6 
  buildPuzzle(16,
    [[0,0,0,1,1,1],
     [0,0,0,1,1,1],
     [5,5,5,5,4,4],
     [2,2,3,3,4,4],
     [2,2,3,3,6,6]],
    {0:'wide',1:'wide',2:'square',3:'square',4:'square',5:'wide',6:'wide'}
  ),
  // 17 - 6x6 
  buildPuzzle(17,
    [[0,0,0,1,1,1],
     [0,0,0,1,1,1],
     [2,2,3,3,4,4],
     [2,2,3,3,4,4],
     [5,5,5,6,6,6],
     [5,5,5,6,6,6]],
    {0:'wide',1:'wide',2:'square',3:'square',4:'square',5:'wide',6:'wide'}
  ),
  // 18 - 6x6 
  buildPuzzle(18,
    [[0,0,1,1,2,2],
     [0,0,1,1,2,2],
     [3,3,4,4,2,2],
     [3,3,4,4,5,5],
     [6,6,7,7,5,5],
     [6,6,7,7,8,8]],
    {0:'square',1:'square',2:'tall',3:'square',4:'square',5:'square',6:'square',7:'square',8:'wide'}
  ),
  // 19 - 6x6 
  buildPuzzle(19,
    [[0,0,1,1,2,2],
     [0,0,1,1,2,2],
     [3,3,4,4,5,5],
     [3,3,4,4,5,5],
     [6,6,7,7,8,8],
     [6,6,7,7,8,8]],
    {0:'square',1:'square',2:'square',3:'square',4:'square',5:'square',6:'square',7:'square',8:'square'}
  ),
  // 20 - 6x6 
  buildPuzzle(20,
    [[0,0,1,1,2,2],
     [0,0,1,1,2,2],
     [3,4,4,5,5,6],
     [3,4,4,5,5,6],
     [3,7,7,8,8,6],
     [3,7,7,8,8,6]],
    {0:'square',1:'square',2:'square',3:'tall',4:'square',5:'square',6:'tall',7:'square',8:'square'}
  ),
];

// ── State ─────────────────────────────────────────────────────────────────────
let ptPuzzle     = ALL_PATCHES_PUZZLES[0];
let ptPlaced     = [];    // [{r1,c1,r2,c2, patchIdx}] placed rectangles
let ptDragStart  = null;
let ptDragEnd    = null;
let ptIsDragging = false;
let ptSolvedSet  = new Set(JSON.parse(localStorage.getItem('ptSolved')||'[]'));
let ptToastTimeout;

const ptGrid    = document.getElementById('pt-grid');
const ptStatus  = document.getElementById('pt-status');
const ptPNum    = document.getElementById('pt-puzzle-num');
const ptRemEl   = document.getElementById('pt-remaining');
const ptSolvEl  = document.getElementById('pt-solved');
const ptLegend  = document.getElementById('pt-legend');
const ptToastEl = document.getElementById('pt-toast');

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildPtSelect();
  loadPatch(ALL_PATCHES_PUZZLES[0]);
  ptSolvEl.textContent = ptSolvedSet.size;
});

function buildPtSelect() {
  const sel = document.getElementById('pt-puzzle-select');
  sel.innerHTML = '';
  ALL_PATCHES_PUZZLES.forEach(p => {
    const btn = document.createElement('button');
    btn.className = 'patches-puzzle-btn'
      + (p.id===ptPuzzle.id?' active':'')
      + (ptSolvedSet.has(p.id)?' solved':'');
    btn.textContent = p.id;
    btn.title = `Puzzle ${p.id} — ${p.rows}×${p.cols}`;
    btn.onclick = () => loadPatch(p);
    sel.appendChild(btn);
  });
}

function loadPatch(p) {
  ptPuzzle    = p;
  ptPlaced    = [];
  ptDragStart = null;
  ptDragEnd   = null;
  ptIsDragging= false;
  ptPNum.textContent    = p.id;
  ptStatus.textContent  = 'Click & drag to draw a rectangle';
  ptStatus.style.color  = 'var(--text-muted)';

  buildPtSelect();
  renderPatchGrid();
  updatePtLegend();
  updatePtRemaining();
  ptShowToast(`Puzzle ${p.id} — ${p.rows}×${p.cols} grid`, '');
}

function renderPatchGrid() {
  const p = ptPuzzle;
  ptGrid.innerHTML = '';
  ptGrid.style.gridTemplateColumns = `repeat(${p.cols}, ${PT_CELL}px)`;
  ptGrid.style.gridTemplateRows    = `repeat(${p.rows}, ${PT_CELL}px)`;
  ptGrid.style.width  = p.cols * PT_CELL + 'px';
  ptGrid.style.height = p.rows * PT_CELL + 'px';

  for (let r = 0; r < p.rows; r++) {
    for (let c = 0; c < p.cols; c++) {
      const cell = document.createElement('div');
      cell.className = 'patch-cell';
      cell.dataset.r = r;
      cell.dataset.c = c;

      // Clue?
      const patch = p.patches.find(pt => pt.clueR===r && pt.clueC===c);
      if (patch) {
        const badge = document.createElement('div');
        badge.className = 'clue-badge';
        const numEl = document.createElement('div');
        numEl.className = 'clue-num';
        numEl.textContent = patch.num;
        numEl.style.color = patch.color;
        const shapeEl = document.createElement('div');
        shapeEl.className = 'clue-shape-icon';
        shapeEl.style.color = patch.color;
        shapeEl.textContent = shapeIcon(patch.shape);
        badge.appendChild(numEl);
        badge.appendChild(shapeEl);
        cell.appendChild(badge);
      }

      cell.addEventListener('mousedown',  e => { e.preventDefault(); ptStartDrag(r,c); });
      cell.addEventListener('mouseenter', () => { if(ptIsDragging) ptMoveDrag(r,c); });
      ptGrid.appendChild(cell);
    }
  }

  ptGrid.addEventListener('mouseup',    ptEndDrag);
  ptGrid.addEventListener('mouseleave', ptEndDrag);

  // Touch
  ptGrid.addEventListener('touchstart', e => {
    e.preventDefault();
    const t = e.touches[0];
    const {r,c} = cellFromTouch(t);
    if(r!=null) ptStartDrag(r,c);
  }, {passive:false});
  ptGrid.addEventListener('touchmove', e => {
    e.preventDefault();
    const t = e.touches[0];
    const {r,c} = cellFromTouch(t);
    if(r!=null && ptIsDragging) ptMoveDrag(r,c);
  }, {passive:false});
  ptGrid.addEventListener('touchend', e => { e.preventDefault(); ptEndDrag(); }, {passive:false});

  applyPatchColors();
}

function cellFromTouch(t) {
  const rect = ptGrid.getBoundingClientRect();
  const x = t.clientX - rect.left;
  const y = t.clientY - rect.top;
  const c = Math.floor(x / PT_CELL);
  const r = Math.floor(y / PT_CELL);
  if (r<0||r>=ptPuzzle.rows||c<0||c>=ptPuzzle.cols) return {r:null,c:null};
  return {r,c};
}

function shapeIcon(s) {
  if (s==='wide')   return '▬ wide';
  if (s==='tall')   return '▮ tall';
  if (s==='square') return '■ square';
  return '✦ any';
}

function updatePtLegend() {
  ptLegend.innerHTML = '';
  ptPuzzle.patches.forEach(pt => {
    const item = document.createElement('div');
    item.className = 'legend-item';
    const sw = document.createElement('div');
    sw.className = 'legend-swatch';
    sw.style.background = pt.color + '44';
    sw.style.borderColor = pt.color;
    item.appendChild(sw);
    item.innerHTML += `${pt.num} cells &nbsp;<span style="opacity:.5">${shapeIcon(pt.shape)}</span>`;
    ptLegend.appendChild(item);
  });
}

function updatePtRemaining() {
  const total = ptPuzzle.patches.length;
  const placed = ptPlaced.length;
  ptRemEl.textContent = total - placed;
  if (placed === total) ptRemEl.style.color = 'var(--teal)';
  else ptRemEl.style.color = 'var(--text)';
}

// ── Drag logic ────────────────────────────────────────────────────────────────
function ptStartDrag(r,c) {
  ptIsDragging = true;
  ptDragStart  = {r,c};
  ptDragEnd    = {r,c};
  highlightDrag();
}

function ptMoveDrag(r,c) {
  ptDragEnd = {r,c};
  highlightDrag();
}

function ptEndDrag() {
  if (!ptIsDragging) return;
  ptIsDragging = false;
  clearDragHighlight();
  if (ptDragStart && ptDragEnd) tryPlaceRect();
  ptDragStart = null;
  ptDragEnd   = null;
}

function highlightDrag() {
  clearDragHighlight();
  if (!ptDragStart || !ptDragEnd) return;
  const r1 = Math.min(ptDragStart.r, ptDragEnd.r);
  const c1 = Math.min(ptDragStart.c, ptDragEnd.c);
  const r2 = Math.max(ptDragStart.r, ptDragEnd.r);
  const c2 = Math.max(ptDragStart.c, ptDragEnd.c);
  getCellsInRect(r1,c1,r2,c2).forEach(el => el && el.classList.add('selected'));
}

function clearDragHighlight() {
  ptGrid.querySelectorAll('.patch-cell.selected').forEach(el => el.classList.remove('selected'));
}

function getCellEl(r,c) {
  return ptGrid.querySelector(`[data-r="${r}"][data-c="${c}"]`);
}

function getCellsInRect(r1,c1,r2,c2) {
  const cells = [];
  for(let r=r1;r<=r2;r++) for(let c=c1;c<=c2;c++) cells.push(getCellEl(r,c));
  return cells;
}

// ── Place rect ────────────────────────────────────────────────────────────────
function tryPlaceRect() {
  const r1 = Math.min(ptDragStart.r, ptDragEnd.r);
  const c1 = Math.min(ptDragStart.c, ptDragEnd.c);
  const r2 = Math.max(ptDragStart.r, ptDragEnd.r);
  const c2 = Math.max(ptDragStart.c, ptDragEnd.c);

  // Check overlap with existing patches
  for (const placed of ptPlaced) {
    if (!(r2<placed.r1 || r1>placed.r2 || c2<placed.c1 || c1>placed.c2)) {
      ptShowToast('Rectangles cannot overlap!','error');
      return;
    }
  }

  // Find clue inside this rect
  const cluePatch = ptPuzzle.patches.find(pt =>
    pt.clueR >= r1 && pt.clueR <= r2 &&
    pt.clueC >= c1 && pt.clueC <= c2
  );

  if (!cluePatch) { ptShowToast('Each rectangle must contain a clue','warning'); return; }

  // Check only one clue inside
  const cluesInside = ptPuzzle.patches.filter(pt =>
    pt.clueR >= r1 && pt.clueR <= r2 &&
    pt.clueC >= c1 && pt.clueC <= c2
  );
  if (cluesInside.length > 1) { ptShowToast('Only one clue per rectangle!','error'); return; }

  // Check cell count
  const area = (r2-r1+1) * (c2-c1+1);
  if (area !== cluePatch.num) {
    ptShowToast(`Needs ${cluePatch.num} cells — you drew ${area}`, 'error');
    return;
  }

  // Check shape constraint
  const h = r2-r1+1, w = c2-c1+1;
  if (cluePatch.shape === 'wide'   && !(w > h))  { ptShowToast('This patch must be wider than tall!','error'); return; }
  if (cluePatch.shape === 'tall'   && !(h > w))  { ptShowToast('This patch must be taller than wide!','error'); return; }
  if (cluePatch.shape === 'square' && !(h === w)){ ptShowToast('This patch must be a square!','error'); return; }

  ptPlaced.push({r1,c1,r2,c2, pIdx: cluePatch.idx});
  applyPatchColors();
  updatePtRemaining();
  checkPtWin();
}

function applyPatchColors() {
  // Clear all bg
  ptGrid.querySelectorAll('.patch-cell').forEach(el => {
    el.style.background = '';
    el.style.borderTop = el.style.borderRight = el.style.borderBottom = el.style.borderLeft = '';
  });

  ptPlaced.forEach(({r1,c1,r2,c2,pIdx}) => {
    const patch = ptPuzzle.patches.find(p=>p.idx===pIdx);
    if (!patch) return;
    const color = patch.color;
    for (let r=r1; r<=r2; r++) {
      for (let c=c1; c<=c2; c++) {
        const el = getCellEl(r,c);
        if (!el) continue;
        el.style.background = color + '22';
        // Draw thick border on rect edges
        if (r===r1) el.style.borderTop    = `2px solid ${color}`;
        if (r===r2) el.style.borderBottom = `2px solid ${color}`;
        if (c===c1) el.style.borderLeft   = `2px solid ${color}`;
        if (c===c2) el.style.borderRight  = `2px solid ${color}`;
      }
    }
  });
}

function checkPtWin() {
  if (ptPlaced.length !== ptPuzzle.patches.length) return;

  // Verify full coverage
  const covered = new Set();
  ptPlaced.forEach(({r1,c1,r2,c2}) => {
    for(let r=r1;r<=r2;r++) for(let c=c1;c<=c2;c++) covered.add(`${r},${c}`);
  });
  if (covered.size !== ptPuzzle.rows * ptPuzzle.cols) {
    ptShowToast('Grid not fully covered yet!','warning');
    return;
  }

  ptSolvedSet.add(ptPuzzle.id);
  localStorage.setItem('ptSolved', JSON.stringify([...ptSolvedSet]));
  ptSolvEl.textContent = ptSolvedSet.size;
  buildPtSelect();

  ptStatus.textContent = '🎉 Puzzle Solved!';
  ptStatus.style.color = 'var(--teal)';
  ptShowToast(`🟦 Puzzle ${ptPuzzle.id} solved!`, 'success');
  gsap.to(ptGrid, { boxShadow:'0 0 40px rgba(245,166,35,0.5)', duration:0.4, yoyo:true, repeat:3 });
}

// ── Controls ──────────────────────────────────────────────────────────────────
function ptUndo() {
  if (ptPlaced.length === 0) return;
  ptPlaced.pop();
  applyPatchColors();
  updatePtRemaining();
  ptStatus.textContent = 'Click & drag to draw a rectangle';
  ptStatus.style.color = 'var(--text-muted)';
}

function ptReset() {
  ptPlaced = [];
  applyPatchColors();
  updatePtRemaining();
  ptStatus.textContent = 'Click & drag to draw a rectangle';
  ptStatus.style.color = 'var(--text-muted)';
  ptShowToast(`Puzzle ${ptPuzzle.id} reset`, '');
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function ptShowToast(text, type='') {
  ptToastEl.textContent = text;
  ptToastEl.className   = type;
  ptToastEl.classList.add('show');
  clearTimeout(ptToastTimeout);
  ptToastTimeout = setTimeout(() => ptToastEl.classList.remove('show'), 3500);
}