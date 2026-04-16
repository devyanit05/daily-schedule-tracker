function renderHistory() {
  const grid = $('history-grid');
  const empty = $('history-empty');
  grid.innerHTML = '';
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() - (historyWeekOffset * 7));
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  const fmt = { month: 'short', day: 'numeric' };
  $('history-range').textContent = `${weekStart.toLocaleDateString('en-US', fmt)} — ${weekEnd.toLocaleDateString('en-US', fmt)}, ${weekEnd.getFullYear()}`;

  let hasData = false;
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart); date.setDate(date.getDate() + i);
    const key = date.toISOString().split('T')[0];
    const day = appData[key];
    if (day && ((day.tasks && day.tasks.length > 0) || Object.keys(day.routineChecks || {}).length > 0 || (day.expenses && day.expenses.length > 0) || day.journal)) {
      hasData = true;
      const rTotal = routineItems.length;
      const rDone = routineItems.filter(r => !!(day.routineChecks || {})[r.id]).length;
      const tTotal = (day.tasks || []).length;
      const tDone = (day.tasks || []).filter(t => t.completed).length;
      const allTotal = rTotal + tTotal;
      const allDone = rDone + tDone;
      const pct = allTotal > 0 ? Math.round((allDone / allTotal) * 100) : 0;
      const spent = (day.expenses || []).reduce((s, e) => s + (e.amount || 0), 0);

      const card = document.createElement('div');
      card.className = 'history-card';
      const dateStr = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      card.innerHTML = `
        <div class="history-card-date">${dateStr}</div>
        <div class="history-card-day">${date.toLocaleDateString('en-US', { weekday: 'long' })}</div>
        <div class="history-card-stats">
          <div class="history-stat"><div class="history-stat-value">${rDone}/${rTotal}</div><div class="history-stat-label">Routine</div></div>
          <div class="history-stat"><div class="history-stat-value">${tDone}/${tTotal}</div><div class="history-stat-label">Tasks</div></div>
          <div class="history-stat"><div class="history-stat-value">₹${formatNumber(spent)}</div><div class="history-stat-label">Spent</div></div>
          <div class="history-stat"><div class="history-stat-value">${pct}%</div><div class="history-stat-label">Score</div></div>
        </div>
        <div class="history-bar"><div class="history-bar-fill" style="width:${pct}%"></div></div>
      `;
      card.addEventListener('click', () => showHistoryDetails(day, dateStr));
      grid.appendChild(card);
    }
  }

  if (hasData) { grid.style.display = 'grid'; empty.classList.add('hidden'); }
  else { grid.style.display = 'none'; empty.classList.remove('hidden'); }

  $('btn-prev-week').onclick = () => { historyWeekOffset++; renderHistory(); };
  $('btn-next-week').onclick = () => { if (historyWeekOffset > 0) { historyWeekOffset--; renderHistory(); } };
  
  // Set up modal closing
  const m = $('history-modal');
  if (m) {
    m.addEventListener('click', (e) => { if (e.target === m) m.classList.add('hidden'); });
    $('history-modal-close').onclick = () => m.classList.add('hidden');
  }
}

function showHistoryDetails(day, dateStr) {
  $('history-modal-title').textContent = "Activity on " + dateStr;
  const content = $('history-modal-content');
  content.innerHTML = '';
  
  // Tasks Section
  let tHtml = '<h4 style="margin-top:10px; margin-bottom:5px; border-bottom:1px solid var(--border-color); padding-bottom:5px;">Daily Tasks</h4>';
  if (day.tasks && day.tasks.length > 0) {
    tHtml += '<ul style="list-style:none; padding-left:0;">';
    day.tasks.forEach(t => {
      const icon = t.completed ? '✅' : '❌';
      tHtml += `<li style="margin-bottom:6px; font-size:0.95rem;">${icon} <span style="display:inline-block; margin-left:8px; ${t.completed ? 'text-decoration:line-through; opacity:0.6;' : ''}">${t.name}</span></li>`;
    });
    tHtml += '</ul>';
  } else {
    tHtml += '<p style="font-size:0.9rem; color:var(--text-muted);">No tasks added this day.</p>';
  }
  
  // Routine Section
  let rHtml = '<h4 style="margin-top:20px; margin-bottom:5px; border-bottom:1px solid var(--border-color); padding-bottom:5px;">My Schedule (Routine)</h4>';
  if (Object.keys(day.routineChecks || {}).length > 0) {
    rHtml += '<ul style="list-style:none; padding-left:0;">';
    routineItems.forEach(r => {
      const checked = (day.routineChecks || {})[r.id];
      if (checked) {
        rHtml += `<li style="margin-bottom:6px; font-size:0.95rem;">✅ <span style="display:inline-block; margin-left:8px;"><strong>${r.time}</strong> - ${r.name}</span></li>`;
      }
    });
    rHtml += '</ul>';
  } else {
    rHtml += '<p style="font-size:0.9rem; color:var(--text-muted);">No schedule checked off.</p>';
  }
  
  // Journal Section
  let jHtml = '<h4 style="margin-top:20px; margin-bottom:5px; border-bottom:1px solid var(--border-color); padding-bottom:5px;">Journal Entry</h4>';
  if (day.journal && day.journal.trim().length > 0) {
    jHtml += `<div style="background:var(--bg-input); padding:12px; border-radius:8px; font-size:0.95rem; white-space:pre-wrap; border-left:4px solid var(--accent-secondary);">${day.journal}</div>`;
  } else {
    jHtml += '<p style="font-size:0.9rem; color:var(--text-muted);">No journal entry written.</p>';
  }
  
  content.innerHTML = tHtml + rHtml + jHtml;
  $('history-modal').classList.remove('hidden');
}
