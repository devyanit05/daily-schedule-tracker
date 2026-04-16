// Helper: compute span in minutes between two 'HH:MM' times
function calcSpanMins(start, end) {
  if (!start || !end) return null;
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let diff = (eh * 60 + em) - (sh * 60 + sm);
  if (diff <= 0) diff += 24 * 60; // overnight (e.g. 22:30 → 05:30)
  return diff;
}

function spanLabel(mins) {
  if (!mins) return '';
  if (mins >= 60) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m ? `${h}h ${m}m` : `${h}h`;
  }
  return `${mins}m`;
}

function formatTime12h(t24) {
  if (!t24) return '';
  const [h, m] = t24.split(':').map(Number);
  const ampm = h < 12 ? 'AM' : 'PM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2,'0')} ${ampm}`;
}

function renderRoutine() {
  const list = $('routine-list');
  const empty = $('routine-empty');
  const today = getTodayData();
  list.innerHTML = '';

  if (routineItems.length === 0) {
    list.style.display = 'none';
    empty.classList.remove('hidden');
  } else {
    list.style.display = 'flex';
    empty.classList.add('hidden');

    routineItems.forEach((item, idx) => {
      const checked = !!today.routineChecks[item.id];
      const el = document.createElement('div');
      el.className = 'routine-item' + (checked ? ' completed' : '');
      el.style.animationDelay = `${idx * 0.04}s`;

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.className = 'routine-checkbox';
      cb.checked = checked;
      cb.id = 'routine-cb-' + idx;
      cb.addEventListener('change', () => {
        today.routineChecks[item.id] = !checked;
        save(DATA_KEY, appData);
        renderRoutine();
        if (typeof updateSidebarStats === 'function') updateSidebarStats();
        if (typeof checkAllDone === 'function') checkAllDone();
      });

      // Time range block
      const timeBlock = document.createElement('div');
      timeBlock.className = 'routine-time-block';
      const startFmt = formatTime12h(item.time);
      const endFmt   = item.endTime ? formatTime12h(item.endTime) : '';
      const mins     = calcSpanMins(item.time, item.endTime);
      timeBlock.innerHTML = `
        <span class="routine-time-start">${startFmt}</span>
        ${endFmt ? `<span class="routine-time-arrow">→</span><span class="routine-time-end">${endFmt}</span>` : ''}
        ${mins ? `<span class="routine-span-badge">${spanLabel(mins)}</span>` : ''}
      `;

      // Name + category badge
      const nameBlock = document.createElement('div');
      nameBlock.className = 'routine-name-block';
      const catColor = item.category === 'work' ? 'var(--accent-primary)' : 'var(--success)';
      const catLabel = item.category === 'work' ? '💼 Work' : '🧘 Personal';
      nameBlock.innerHTML = `
        <span class="routine-name">${item.name}</span>
        <span class="routine-cat-badge" style="background:${catColor}20; color:${catColor};">${catLabel}</span>
      `;

      el.appendChild(cb);
      el.appendChild(timeBlock);
      el.appendChild(nameBlock);
      list.appendChild(el);
    });
  }

  // Update counts
  const done = routineItems.filter(r => !!today.routineChecks[r.id]).length;
  $('routine-done').textContent = done;
  $('routine-total').textContent = routineItems.length;
}

function setupRoutineManager() {
  renderRoutineManager();

  $('btn-add-routine').addEventListener('click', addRoutineItem);
  $('routine-input').addEventListener('keydown', e => { if (e.key === 'Enter') addRoutineItem(); });
}

function addRoutineItem() {
  const name = $('routine-input').value.trim();
  const time = $('routine-time-input').value || '';
  if (!name) {
    $('routine-input').style.borderColor = 'var(--danger)';
    setTimeout(() => $('routine-input').style.borderColor = '', 1200);
    return;
  }
  routineItems.push({
    id: 'r_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
    name,
    time: time ? formatTime12(time) : ''
  });
  save(ROUTINE_KEY, routineItems);
  $('routine-input').value = '';
  $('routine-time-input').value = '';
  renderRoutineManager();
  renderRoutine();
  if (typeof updateSidebarStats === 'function') updateSidebarStats();
}

function deleteRoutineItem(idx) {
  routineItems.splice(idx, 1);
  save(ROUTINE_KEY, routineItems);
  renderRoutineManager();
  renderRoutine();
  if (typeof updateSidebarStats === 'function') updateSidebarStats();
}

function renderRoutineManager() {
  const list = $('routine-manager-list');
  list.innerHTML = '';
  if (routineItems.length === 0) {
    $('routine-hint').style.display = 'none';
    return;
  }
  $('routine-hint').style.display = 'block';

  routineItems.forEach((item, idx) => {
    const el = document.createElement('div');
    el.className = 'routine-mgr-item';
    const timeRange = item.endTime
      ? `${formatTime12h(item.time)} → ${formatTime12h(item.endTime)}`
      : (item.time || '—');
    el.innerHTML = `
      <span class="routine-mgr-handle">≡</span>
      <span class="routine-mgr-time">${timeRange}</span>
      <span class="routine-mgr-name">${escapeHTML(item.name)}</span>
    `;
    const del = document.createElement('button');
    del.className = 'routine-mgr-delete';
    del.textContent = '✕';
    del.addEventListener('click', () => deleteRoutineItem(idx));
    el.appendChild(del);
    list.appendChild(el);
  });
}
