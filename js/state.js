let appData;
let settings;
let routineItems;
let careerChecks;
let financeState;
let waterTimerId = null;
let taskTimerId = null;
let historyWeekOffset = 0;
let journalSaveTimer = null;

const FINANCE_KEY = 'daytrack_finance_state';

function load(key, fallback) {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; }
  catch { return fallback; }
}

function save(key, val) { 
  localStorage.setItem(key, JSON.stringify(val)); 
}

function todayKey() { 
  return new Date().toISOString().split('T')[0]; 
}

function getTodayData() {
  const k = todayKey();
  if (!appData[k]) {
    // Fresh day — seed with default tasks
    const seededTasks = DEFAULT_TASKS.map((t, i) => ({
      name: t.name,
      category: t.category,
      priority: t.priority,
      completed: false,
      createdAt: new Date().toISOString()
    }));
    appData[k] = { tasks: seededTasks, waterCount: 0, routineChecks: {}, journal: '', expenses: [] };
    save(DATA_KEY, appData);
  }
  const d = appData[k];
  if (!d.routineChecks) d.routineChecks = {};
  if (!d.journal) d.journal = '';
  if (!d.expenses) d.expenses = [];
  if (!d.tasks) d.tasks = [];
  if (d.waterCount === undefined) d.waterCount = 0;
  return d;
}

// Ensure state is loaded
function loadState() {
  appData = load(DATA_KEY, {});
  settings = load(SETTINGS_KEY, {
    userName: '', waterReminder: true, waterInterval: 30,
    taskReminder: true, darkMode: true
  });
  routineItems = load(ROUTINE_KEY, []);
  
  // Corrected timetable v2 — with start/end times and categories
  if (!localStorage.getItem('corrected_timetable_v2')) {
    routineItems = [
      { id: 'rt_1',  time: '05:30', endTime: '06:00', name: 'Get Up, Get Ready, Go to swim',                       category: 'personal' },
      { id: 'rt_2',  time: '06:00', endTime: '08:00', name: 'Swim, Fresh Up, Get back home',                       category: 'personal' },
      { id: 'rt_3',  time: '08:00', endTime: '09:30', name: 'Cook Breakfast, Lunch',                               category: 'personal' },
      { id: 'rt_4',  time: '09:30', endTime: '10:30', name: 'Analyze Runs, Mark Excel, for AP runs, retrigger if necessary', category: 'work' },
      { id: 'rt_5',  time: '10:30', endTime: '11:00', name: 'Breakfast',                                           category: 'personal' },
      { id: 'rt_6',  time: '11:00', endTime: '11:30', name: 'Watch Google Courses Videos',                         category: 'personal' },
      { id: 'rt_7',  time: '11:30', endTime: '12:15', name: 'Dev : AbacusToTrino morning meeting',                 category: 'work' },
      { id: 'rt_8',  time: '12:15', endTime: '12:30', name: 'TRINO - Daily scrum : Rahul C',                       category: 'work' },
      { id: 'rt_9',  time: '12:30', endTime: '13:00', name: 'AWV Planning/Execution',                              category: 'work' },
      { id: 'rt_10', time: '13:00', endTime: '13:30', name: 'AWV - Daily scrum : Rahul C',                         category: 'work' },
      { id: 'rt_11', time: '13:30', endTime: '14:30', name: 'Lunch',                                               category: 'personal' },
      { id: 'rt_12', time: '14:30', endTime: '15:00', name: 'Daily Standup - Chapter Test-Automation',             category: 'work' },
      { id: 'rt_13', time: '15:00', endTime: '16:00', name: 'Analyze JIRA to see if any changes are needed',       category: 'work' },
      { id: 'rt_14', time: '16:00', endTime: '18:00', name: 'Actual Work',                                         category: 'work' },
      { id: 'rt_15', time: '18:00', endTime: '18:30', name: 'Check JIRA, EXCEL / Trino Adaptor & AWV: Bi-weekly catch-up', category: 'work' },
      { id: 'rt_16', time: '18:30', endTime: '19:00', name: 'Fix status Trino',                                    category: 'work' },
      { id: 'rt_17', time: '19:00', endTime: '21:30', name: 'Walk, Cook Dinner, Do household chores',              category: 'personal' },
      { id: 'rt_18', time: '21:30', endTime: '22:00', name: 'Dinner',                                              category: 'personal' },
      { id: 'rt_19', time: '22:00', endTime: '22:30', name: 'Read a book and Skincare',                            category: 'personal' },
      { id: 'rt_20', time: '22:30', endTime: '05:30', name: 'Sleep',                                               category: 'personal' },
    ];
    save(ROUTINE_KEY, routineItems);
    localStorage.setItem('corrected_timetable_v2', 'true');
  }

  careerChecks = load(CAREER_CHECKLIST_KEY, {});
  
  // Migrate from DEFAULT_FINANCE if needed
  financeState = load(FINANCE_KEY, DEFAULT_FINANCE);
  // Ensure we have upcoming array
  if (!financeState.upcoming) financeState.upcoming = [];
  if (!financeState.budgets) financeState.budgets = DEFAULT_FINANCE.budgets;
}

loadState();
