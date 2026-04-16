function setupNavigation() {
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
      $('view-' + btn.dataset.view).classList.add('active');
      if (btn.dataset.view === 'history' && typeof renderHistory === 'function') renderHistory();
      $('sidebar').classList.remove('open');
    });
  });
}

function setupSectionTabs() {
  document.querySelectorAll('.section-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.section-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.today-section').forEach(s => s.classList.remove('active'));
      $('section-' + tab.dataset.section).classList.add('active');
    });
  });

  const gotoBtn = $('btn-goto-settings');
  if (gotoBtn) {
    gotoBtn.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
      $('nav-settings').classList.add('active');
      document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
      $('view-settings').classList.add('active');
    });
  }
}

function setupSidebar() {
  const mobileBtn = $('mobile-menu-btn');
  if (mobileBtn) {
    mobileBtn.addEventListener('click', () => $('sidebar').classList.toggle('open'));
  }
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && !$('sidebar').contains(e.target) && e.target !== mobileBtn) {
      $('sidebar').classList.remove('open');
    }
  });
}

function updateSidebarStats() {
  const today = getTodayData();

  // Routine
  const rTotal = routineItems.length;
  const rDone = routineItems.filter(r => !!today.routineChecks[r.id]).length;
  $('sidebar-routine-stat').textContent = `${rDone}/${rTotal}`;

  // Tasks
  const tTotal = today.tasks.length;
  const tDone = today.tasks.filter(t => t.completed).length;
  $('sidebar-tasks-stat').textContent = `${tDone}/${tTotal}`;

  // Overall %
  const totalItems = rTotal + tTotal;
  const totalDone = rDone + tDone;
  const pct = totalItems > 0 ? Math.round((totalDone / totalItems) * 100) : 0;

  $('progress-ring-text').textContent = pct + '%';
  const circumference = 2 * Math.PI * 48;
  $('progress-ring-fill').style.strokeDasharray = circumference;
  $('progress-ring-fill').style.strokeDashoffset = circumference - (pct / 100) * circumference;
}
