const MAX_TASKS = 10;
const WATER_GOAL = 8;
const DATA_KEY = 'daytrack_data';
const SETTINGS_KEY = 'daytrack_settings';
const ROUTINE_KEY = 'daytrack_routine';
const CAREER_CHECKLIST_KEY = 'daytrack_career_checks';


const CATEGORY_LABELS = {
  health: '🏃 Health', work: '💼 Work', learning: '📚 Learning',
  personal: '🧘 Personal', social: '👥 Social', creative: '🎨 Creative',
  chores: '🏠 Chores', skincare: '✨ Skin Care', haircare: '💆‍♀️ Hair Care',
  nutrition: '🥦 Healthy Food', spiritual: '🙏 Prayer', finance: '📈 Finance',
  other: '📌 Other'
};

const EXPENSE_ICONS = {
  food: '🍕', transport: '🚂', fuel: '🚗', shopping: '🛍️', rent: '🏠',
  bills: '📄', entertainment: '🎬', health: '💊', education: '📚',
  investments: '📈', ppf: '🏛️', swimming: '🏊', emergency: '🚨', other: '📌'
};

const EXPENSE_LABELS = {
  food: 'Food', transport: 'Transport', fuel: 'Fuel', shopping: 'Shopping', 
  rent: 'Room Rent', bills: 'Bills', entertainment: 'Entertainment', health: 'Health', 
  education: 'Education', investments: 'Investments', ppf: 'PPF', 
  swimming: 'Swimming Class', emergency: 'Emergency Fund', other: 'Other'
};

const DEFAULT_FINANCE = {
  monthlyIncome: 50000,
  budgets: {
    investments: 12500, ppf: 2000, rent: 6000, fuel: 1000, swimming: 3000, emergency: 5000,
    food: 8000, transport: 2000, shopping: 4000, bills: 2000, entertainment: 2000, health: 1000, education: 500, other: 1000
  },
  upcoming: []
};

const DEFAULT_TASKS = [
  { name: 'Walk for 30 mins',          category: 'health',    priority: 'high'   },
  { name: 'Drink 3L water',            category: 'health',    priority: 'high'   },
  { name: 'No sugar and junk',         category: 'nutrition', priority: 'high'   },
  { name: 'Night skincare routine',    category: 'skincare',  priority: 'medium' },
  { name: 'ABC Juice',                 category: 'nutrition', priority: 'medium' },
  { name: 'Pray to God',              category: 'spiritual', priority: 'high'   },
  { name: 'Plan next day',             category: 'personal',  priority: 'medium' },
  { name: 'Job switch effort - 30 min',category: 'work',      priority: 'high'   },
  { name: 'Swim',                      category: 'health',    priority: 'medium' },
  { name: 'Restock breakfast, proteins',category: 'chores',   priority: 'low'    },
];
