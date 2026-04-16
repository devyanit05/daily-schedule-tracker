function renderWaterGlasses() {
  const c = $('water-glasses');
  c.innerHTML = '';
  const today = getTodayData();
  for (let i = 0; i < WATER_GOAL; i++) {
    const g = document.createElement('button');
    g.className = 'water-glass' + (i < today.waterCount ? ' filled' : '');
    g.innerHTML = '<span>💧</span>';
    g.title = 'Glass ' + (i + 1);
    g.addEventListener('click', () => { toggleWater(i); });
    c.appendChild(g);
  }
  $('water-count').textContent = today.waterCount;
}

function toggleWater(i) {
  const t = getTodayData();
  t.waterCount = i < t.waterCount ? i : i + 1;
  save(DATA_KEY, appData);
  renderWaterGlasses();
  if (typeof updateSidebarStats === 'function') updateSidebarStats();
}
