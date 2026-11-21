// ==========================================================
// 1. 2026/27 LIVERPOOL FC FIRST-TEAM DATASET
// ==========================================================
const squad = [
    { num: 1, name: "Alisson Becker", role: "GK", pos: "Goalkeeper", nation: "Brazil", rating: 91, pace: 56, passing: 86, defense: 92, attack: 25 },
    { num: 25, name: "Giorgi Mamardashvili", role: "GK", pos: "Goalkeeper", nation: "Georgia", rating: 86, pace: 52, passing: 78, defense: 87, attack: 20 },
    { num: 4, name: "Virgil van Dijk", role: "DEF", pos: "Centre-Back (C)", nation: "Netherlands", rating: 90, pace: 78, passing: 85, defense: 92, attack: 68 },
    { num: 33, name: "Ronald Araújo", role: "DEF", pos: "Centre-Back", nation: "Uruguay", rating: 87, pace: 85, passing: 76, defense: 89, attack: 62 },
    { num: 5, name: "Jérémy Jacquet", role: "DEF", pos: "Centre-Back", nation: "France", rating: 82, pace: 80, passing: 81, defense: 83, attack: 55 },
    { num: 6, name: "Milos Kerkez", role: "DEF", pos: "Left-Back", nation: "Hungary", rating: 84, pace: 89, passing: 80, defense: 81, attack: 79 },
    { num: 30, name: "Jeremie Frimpong", role: "DEF", pos: "Right-Back", nation: "Netherlands", rating: 86, pace: 94, passing: 82, defense: 78, attack: 85 },
    { num: 12, name: "Conor Bradley", role: "DEF", pos: "Right-Back", nation: "Northern Ireland", rating: 81, pace: 85, passing: 79, defense: 80, attack: 75 },
    { num: 10, name: "Alexis Mac Allister", role: "MID", pos: "Central Midfielder", nation: "Argentina", rating: 88, pace: 74, passing: 90, defense: 84, attack: 83 },
    { num: 38, name: "Ryan Gravenberch", role: "MID", pos: "Defensive Midfielder", nation: "Netherlands", rating: 86, pace: 82, passing: 86, defense: 84, attack: 79 },
    { num: 8, name: "Dominik Szoboszlai", role: "MID", pos: "Attacking Midfielder", nation: "Hungary", rating: 86, pace: 84, passing: 87, defense: 76, attack: 85 },
    { num: 7, name: "Florian Wirtz", role: "MID", pos: "Attacking Midfielder", nation: "Germany", rating: 90, pace: 85, passing: 92, defense: 62, attack: 91 },
    { num: 3, name: "Wataru Endō", role: "MID", pos: "Defensive Midfielder", nation: "Japan", rating: 81, pace: 68, passing: 79, defense: 85, attack: 65 },
    { num: 9, name: "Alexander Isak", role: "FWD", pos: "Centre-Forward", nation: "Sweden", rating: 89, pace: 88, passing: 81, defense: 45, attack: 91 },
    { num: 18, name: "Cody Gakpo", role: "FWD", pos: "Left / Right Winger", nation: "Netherlands", rating: 87, pace: 86, passing: 84, defense: 58, attack: 87 },
    { num: 22, name: "Hugo Ekitike", role: "FWD", pos: "Centre-Forward", nation: "France", rating: 84, pace: 86, passing: 77, defense: 42, attack: 85 },
    { num: 29, name: "Bradley Barcola", role: "FWD", pos: "Winger", nation: "France", rating: 85, pace: 92, passing: 81, defense: 48, attack: 86 },
    { num: 14, name: "Federico Chiesa", role: "FWD", pos: "Right Winger", nation: "Italy", rating: 84, pace: 89, passing: 80, defense: 52, attack: 85 }
  ];
  
  // ==========================================================
  // 2. STATE MANAGEMENT WITH LOCALSTORAGE PERSISTENCE
  // ==========================================================
  const DEFAULT_XI =;
  const STORAGE_KEY = 'lfc_pro_suite_state_v1';
  
  function loadSavedState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  
  function saveState() {
    const payload = {
      currentXI,
      activeFormation,
      awayTheme: document.body.classList.contains('away-theme')
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }
  
  const saved = loadSavedState();
  let activeRole = 'ALL';
  let searchQuery = '';
  let activeFormation = saved?.activeFormation || '4231';
  let currentXI = Array.isArray(saved?.currentXI) && saved.currentXI.length === 11
    ? saved.currentXI
    : [...DEFAULT_XI];
  
  const pitchCoords = {
    '4231': [
      { x: 50, y: 90 }, { x: 84, y: 72 }, { x: 63, y: 76 }, { x: 37, y: 76 }, { x: 16, y: 72 },
      { x: 62, y: 56 }, { x: 38, y: 56 }, { x: 82, y: 36 }, { x: 50, y: 38 }, { x: 18, y: 36 }, { x: 50, y: 16 }
    ],
    '433': [
      { x: 50, y: 90 }, { x: 84, y: 73 }, { x: 63, y: 77 }, { x: 37, y: 77 }, { x: 16, y: 73 },
      { x: 50, y: 58 }, { x: 70, y: 46 }, { x: 30, y: 46 }, { x: 82, y: 24 }, { x: 18, y: 24 }, { x: 50, y: 15 }
    ],
    '343': [
      { x: 50, y: 90 }, { x: 76, y: 75 }, { x: 50, y: 78 }, { x: 24, y: 75 }, { x: 85, y: 50 },
      { x: 62, y: 54 }, { x: 38, y: 54 }, { x: 15, y: 50 }, { x: 78, y: 25 }, { x: 22, y: 25 }, { x: 50, y: 15 }
    ]
  };
  
  // ==========================================================
  // 3. ROSTER FILTERING & RENDERING
  // ==========================================================
  function renderRoster() {
    const filtered = squad.filter(p =>
      (activeRole === 'ALL' || p.role === activeRole) &&
      (p.name.toLowerCase().includes(searchQuery) || String(p.num).includes(searchQuery))
    );
  
    document.getElementById('rosterCount').textContent = `${filtered.length} Players`;
    document.getElementById('rosterGrid').innerHTML = filtered.map(p => `
      <div class="player-card" onclick="openScoutModal(${p.num})">
        <div>
          <div class="card-head">
            <span class="num">#${p.num}</span>
            <span class="badge">${p.role}</span>
          </div>
          <div class="p-name">${p.name}</div>
          <div class="p-sub">${p.pos} • ${p.nation}</div>
        </div>
        <div class="card-foot">
          <span style="font-size:0.72rem; color:var(--text-dim);">PRO INDEX</span>
          <div class="ring" style="--val:${p.rating}"><span>${p.rating}</span></div>
        </div>
      </div>
    `).join('');
  }
  
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeRole = btn.dataset.role;
      renderRoster();
    });
  });
  
  document.getElementById('searchInput').addEventListener('input', e => {
    searchQuery = e.target.value.trim().toLowerCase();
    renderRoster();
  });
  
  // ==========================================================
  // 4. INTERACTIVE PITCH & SUBSTITUTIONS
  // ==========================================================
  const pitchEl = document.getElementById('pitch');
  
  currentXI.forEach((_, idx) => {
    const node = document.createElement('div');
    node.className = 'node';
    node.id = `pitch-slot-${idx}`;
    node.addEventListener('click', () => openSwapModal(idx));
    pitchEl.appendChild(node);
  });
  
  function renderPitch() {
    const layout = pitchCoords[activeFormation];
    currentXI.forEach((kitNum, idx) => {
      const p = squad.find(item => item.num === kitNum) || squad[0];
      const shortName = p.name.split(' ').pop();
      const node = document.getElementById(`pitch-slot-${idx}`);
      node.style.left = `${layout[idx].x}%`;
      node.style.top = `${layout[idx].y}%`;
      node.innerHTML = `<div class="dot">${p.num}</div><span class="tag">${shortName}</span>`;
    });
  }
  
  document.querySelectorAll('.pill[data-formation]').forEach(pill => {
    if (pill.dataset.formation === activeFormation) {
      document.querySelectorAll('.pill[data-formation]').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    }
  
    pill.addEventListener('click', () => {
      document.querySelectorAll('.pill[data-formation]').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeFormation = pill.dataset.formation;
      saveState();
      renderPitch();
    });
  });
  
  // ==========================================================
  // 5. MODALS (SCOUTING & PITCH SWAP)
  // ==========================================================
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalCard = document.getElementById('modalCard');
  
  function openScoutModal(num) {
    const p = squad.find(item => item.num === num);
    modalCard.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
        <div>
          <span style="color:var(--gold); font-weight:800;">#${p.num} • ${p.pos}</span>
          <h3>${p.name}</h3>
          <small style="color:var(--text-dim);">${p.nation}</small>
        </div>
        <div class="ring" style="--val:${p.rating}; width:48px; height:48px; font-size:0.9rem;"><span>${p.rating}</span></div>
      </div>
      <p style="font-size:0.85rem; color:var(--text-dim); margin-bottom:1.2rem;">
        Pace: <strong>${p.pace}</strong> • Passing: <strong>${p.passing}</strong> • Attack: <strong>${p.attack}</strong> • Defense: <strong>${p.defense}</strong>
      </p>
      <button class="action-btn primary" style="width:100%;" onclick="closeModal()">Close Report</button>
    `;
    modalBackdrop.classList.add('open');
  }
  
  function openSwapModal(slotIndex) {
    const currentP = squad.find(p => p.num === currentXI[slotIndex]);
    const options = squad.map(p => `
      <option value="${p.num}" ${p.num === currentP.num ? 'selected' : ''}>
        #${p.num} ${p.name} (${p.role} - ${p.rating})
      </option>
    `).join('');
  
    modalCard.innerHTML = `
      <h3 style="margin-bottom:0.35rem;">Tactical Substitution</h3>
      <p style="color:var(--text-dim); font-size:0.85rem; margin-bottom:1rem;">
        Replacing <strong>#${currentP.num} ${currentP.name}</strong>
      </p>
      <select id="swapSelect" class="pro-select" style="margin-bottom:1rem;">${options}</select>
      <div style="display:flex; gap:10px;">
        <button class="action-btn primary" onclick="confirmSwap(${slotIndex})">Save Lineup</button>
        <button class="action-btn secondary" onclick="resetDefaultXI()">Reset XI</button>
        <button class="action-btn secondary" onclick="closeModal()">Cancel</button>
      </div>
    `;
    modalBackdrop.classList.add('open');
  }
  
  function confirmSwap(slotIndex) {
    currentXI[slotIndex] = Number(document.getElementById('swapSelect').value);
    saveState();
    renderPitch();
    closeModal();
  }
  
  