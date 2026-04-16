function renderTasks() {
  const today = getTodayData();
  const list = $('task-list');
  const empty = $('tasks-empty');
  const summary = $('tasks-summary');
  list.innerHTML = '';

  if (today.tasks.length === 0) {
    list.style.display = 'none';
    empty.classList.remove('hidden');
    summary.style.display = 'none';
  } else {
    list.style.display = 'flex';
    empty.classList.add('hidden');
    summary.style.display = 'block';

    today.tasks.forEach((task, idx) => {
      const el = document.createElement('div');
      el.className = 'task-item' + (task.completed ? ' completed' : '');
      el.style.animationDelay = `${idx * 0.04}s`;

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.className = 'task-checkbox';
      cb.checked = task.completed;
      cb.addEventListener('change', () => {
        task.completed = !task.completed;
        save(DATA_KEY, appData);
        renderTasks();
        if (typeof updateSidebarStats === 'function') updateSidebarStats();
        if (typeof checkAllDone === 'function') checkAllDone();
      });

      const info = document.createElement('div');
      info.className = 'task-info';

      const name = document.createElement('span');
      name.className = 'task-name';
      name.textContent = task.name;

      const meta = document.createElement('div');
      meta.className = 'task-meta';

      const cat = document.createElement('span');
      cat.className = 'task-category';
      cat.textContent = CATEGORY_LABELS[task.category] || task.category;

      const pri = document.createElement('span');
      pri.className = 'task-priority ' + task.priority;
      pri.textContent = task.priority;

      meta.appendChild(cat);
      meta.appendChild(pri);
      info.appendChild(name);
      info.appendChild(meta);

      const del = document.createElement('button');
      del.className = 'task-delete';
      del.innerHTML = '🗑️';
      del.title = 'Delete';
      del.addEventListener('click', () => {
        today.tasks.splice(idx, 1);
        save(DATA_KEY, appData);
        renderTasks();
        if (typeof updateSidebarStats === 'function') updateSidebarStats();
      });

      el.appendChild(cb);
      el.appendChild(info);
      el.appendChild(del);
      list.appendChild(el);
    });
  }

  // Stats
  const total = today.tasks.length;
  const done = today.tasks.filter(t => t.completed).length;
  $('tasks-done').textContent = done;
  $('tasks-total').textContent = total;
  $('task-counter').textContent = `${total} / ${MAX_TASKS}`;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  $('tasks-bar-fill').style.width = pct + '%';
}

function setupTaskModal() {
  const modal = $('add-task-modal');
  const openBtns = [$('btn-add-task'), $('btn-add-first-task')];
  const closeBtns = [$('modal-close'), $('modal-cancel')];

  openBtns.forEach(b => b && b.addEventListener('click', openTaskModal));
  closeBtns.forEach(b => b && b.addEventListener('click', closeTaskModal));
  modal.addEventListener('click', e => { if (e.target === modal) closeTaskModal(); });
  $('modal-add').addEventListener('click', handleAddTask);
  $('task-input').addEventListener('keydown', e => { if (e.key === 'Enter') handleAddTask(); });

  document.querySelectorAll('.priority-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.priority-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

function openTaskModal() {
  if (getTodayData().tasks.length >= MAX_TASKS) {
    showToast('⚠️', 'Task Limit Reached', `Max ${MAX_TASKS} tasks per day.`);
    return;
  }
  $('add-task-modal').classList.remove('hidden');
  $('task-input').value = '';
  $('task-category').value = 'personal';
  document.querySelectorAll('.priority-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.priority-btn[data-priority="medium"]').classList.add('active');
  setTimeout(() => $('task-input').focus(), 100);
}

function closeTaskModal() { $('add-task-modal').classList.add('hidden'); }

function handleAddTask() {
  const name = $('task-input').value.trim();
  if (!name) {
    $('task-input').style.borderColor = 'var(--danger)';
    $('task-input').focus();
    setTimeout(() => { $('task-input').style.borderColor = ''; }, 1200);
    return;
  }
  const cat = $('task-category').value;
  const prBtn = document.querySelector('.priority-btn.active');
  const pri = prBtn ? prBtn.dataset.priority : 'medium';
  const today = getTodayData();
  if (today.tasks.length >= MAX_TASKS) return;
  today.tasks.push({ name, category: cat, priority: pri, completed: false, createdAt: new Date().toISOString() });
  save(DATA_KEY, appData);
  renderTasks();
  if (typeof updateSidebarStats === 'function') updateSidebarStats();
  closeTaskModal();
}
