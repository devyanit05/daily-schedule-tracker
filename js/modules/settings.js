function setupSettings() {
  const waterToggle = $('water-reminder-toggle');
  const waterInterval = $('water-interval');
  const taskToggle = $('task-reminder-toggle');
  const themeToggle = $('theme-toggle');

  waterToggle.checked = settings.waterReminder;
  waterInterval.value = settings.waterInterval;
  taskToggle.checked = settings.taskReminder;
  themeToggle.checked = settings.darkMode;

  waterToggle.addEventListener('change', () => { settings.waterReminder = waterToggle.checked; save(SETTINGS_KEY, settings); startReminders(); });
  waterInterval.addEventListener('change', () => { settings.waterInterval = parseInt(waterInterval.value); save(SETTINGS_KEY, settings); startReminders(); });
  taskToggle.addEventListener('change', () => { settings.taskReminder = taskToggle.checked; save(SETTINGS_KEY, settings); startReminders(); });
  themeToggle.addEventListener('change', () => { settings.darkMode = themeToggle.checked; save(SETTINGS_KEY, settings); applyTheme(); });

  $('btn-export').addEventListener('click', exportData);
  $('btn-clear-data').addEventListener('click', clearAllData);
}

function startReminders() {
  if (waterTimerId) clearInterval(waterTimerId);
  if (taskTimerId) clearInterval(taskTimerId);

  if (settings.waterReminder) {
    waterTimerId = setInterval(() => {
      showToast('💧', 'Hydration Reminder!', 'Time to drink a glass of water. Stay hydrated! 💪');
    }, settings.waterInterval * 60 * 1000);
  }

  if (settings.taskReminder) {
    taskTimerId = setInterval(() => {
      const today = getTodayData();
      const pending = today.tasks.filter(t => !t.completed).length;
      const routinePending = routineItems.filter(r => !today.routineChecks[r.id]).length;
      if (pending + routinePending > 0) {
        showToast('📋', 'Task Check-In!', `You have ${pending + routinePending} pending items. Keep going!`);
      }
    }, 60 * 60 * 1000);
  }
}

function updateStreak() {
  let streak = 0;
  const now = new Date();
  
  for (let i = 0; i <= 365; i++) {
    const d = new Date(now); 
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const day = appData[key];
    
    let hasActivity = false;
    if (day) {
      const rD = routineItems.filter(r => !!(day.routineChecks || {})[r.id]).length;
      const tD = (day.tasks || []).filter(t => t.completed).length;
      const wC = day.waterCount || 0;
      const eD = (day.expenses || []).length;
      const jD = (day.journal && day.journal.trim().length > 0);
      
      if (rD > 0 || tD > 0 || wC > 0 || eD > 0 || jD) {
        hasActivity = true;
      }
    }
    
    if (i === 0) {
      // Today
      if (hasActivity) streak++;
    } else {
      // Yesterday and backwards
      if (hasActivity) streak++;
      else break;
    }
  }
  
  $('streak-count').textContent = streak;
}

function checkAllDone() {
  const today = getTodayData();
  const rTotal = routineItems.length;
  const rDone = routineItems.filter(r => !!today.routineChecks[r.id]).length;
  const tTotal = today.tasks.length;
  const tDone = today.tasks.filter(t => t.completed).length;
  if (rTotal + tTotal > 0 && rDone + tDone === rTotal + tTotal) {
    launchConfetti();
  }
  updateStreak();
}

function exportData() {
  const exportObj = { data: appData, settings, routine: routineItems };
  const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `daytrack_export_${todayKey()}.json`; a.click();
  URL.revokeObjectURL(url);
}

function clearAllData() {
  if (confirm('⚠️ This will permanently delete ALL your data. Continue?')) {
    if (confirm('This cannot be undone. Are you sure?')) {
      appData = {};
      save(DATA_KEY, appData);
      renderRoutine(); renderTasks(); renderWaterGlasses(); renderExpenses();
      renderJournal(); updateSidebarStats(); updateStreak(); renderHistory();
    }
  }
}
