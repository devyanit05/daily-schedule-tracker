// ===========================
// DAYTRACK — INIT.JS
// ===========================

function init() {
  loadState();

  applyTheme();
  renderDate();
  renderGreeting();
  renderMotivation();
  
  renderWaterGlasses();
  renderRoutine();
  renderTasks();
  renderJournal();
  
  initFinanceModule();
  
  initCareerModule();
  
  updateSidebarStats();
  
  setupNavigation();
  setupSectionTabs();
  setupTaskModal();
  setupSettings();
  setupRoutineManager();
  setupSidebar();
  
  startReminders();
  updateStreak();
  renderHistory();
}

document.addEventListener('DOMContentLoaded', init);
