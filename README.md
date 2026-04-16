# DayTrack — Daily Schedule Tracker

DayTrack is a fully offline, client-side personal daily schedule and habit tracking web application. It functions as a complete daily dashboard for your habits, routines, expenditures, and career preparation. The app is built with pure HTML, CSS, and Vanilla JavaScript, relying entirely on the browser's `localStorage` for data persistence—meaning your data stays securely on your device!

## Features

* **📅 Today's Dashboard:** 
  A centralized hub for the current day containing widgets to track your daily routine, tasks, journal, finances, and interview prep.
* **💧 Water Tracker:** 
  Keep track of your daily hydration goals with easy visual indicators.
* **📋 Fixed Routine Management:** 
  Configure a recurring daily timetable to manage scheduled time-blocks (e.g., wake up, swim, work sprints, skincare).
* **🎯 Daily Tasks:** 
  Add, prioritize, and check off up to 10 adaptable to-do items per day across multiple categories.
* **📝 Daily Journal:** 
  A space for daily reflection and gratitude with contextual prompts. Auto-saves as you type.
* **💰 Finance Manager:** 
  Log expenses, view your predictive burn rate, manage granular monthly budgets (Rent, Investments, etc.), and plan upcoming trips with an exclusive "Travel Mode" vault.
* **🚀 Job Change Mastery:** 
  Prep for your next career move with checklists, technical practice algorithms, behavioral mock interviews (with expected answer criteria and a timer), and English fluency exercises.
* **📊 Activity History:** 
  Navigate past days and view comprehensive history grids of your prior achievements.
* **⚙️ Settings & Customization:** 
  Data export (JSON), app theme customization (Dark/Light mode), and fine-grained notifications handling.

## Tech Stack

* **HTML5:** Semantic markup.
* **CSS3:** Vanilla modern CSS layout, custom properties, and dark mode theming without the bulk of CSS frameworks.
* **Vanilla JavaScript (ES6+):** Application logic, strictly modularized without framework overhead.
* **Chart.js:** Used for generating dynamic burn rate and compound investment growth visualizations.
* **Storage:** Native `localStorage` implementation for offline data retention.

## Getting Started

Because DayTrack does not rely on a backend build step or compilation, it is incredibly simple to set up. 

### Method 1: VS Code "Live Server" (Recommended)
1. Open this project folder in Visual Studio Code.
2. Install the **Live Server** extension.
3. Open `index.html` and click **"Go Live"** in the bottom right corner of the window.

### Method 2: Python HTTP Server
If you have Python installed, you can quickly boot up a web server from the terminal. This acts as a reliable stand-in if Node.js `npx` servers complain about authentication issues:

```bash
python -m http.server 8000
```
Then navigate to `http://localhost:8000` in your browser.

### Method 3: Direct File Open
You can directly open `index.html` using a web browser directly from your file system. Note that some features may conflict with your browser's CORS local file execution rules, making Method 1 or 2 superior.

## Project Structure
```text
DayTrack/
├── index.html         # Main dashboard layout
├── index.css          # Master stylesheet
├── README.md          # Project Documentation
└── js/                # Javascript application logic
    ├── constants.js   # Application defaults & configs
    ├── init.js        # Main bootstrap & invocation sequence
    ├── state.js       # Complete LocalStorage data management 
    ├── ui.js          # Reusable DOM utility bindings
    ├── utils.js       # Shared helpers
    └── modules/       # Decoupled component-features
        ├── career.js
        ├── history.js
        ├── journal.js
        ├── navigation.js
        ├── routine.js
        ├── spendings.js
        ├── tasks.js
        └── water.js
```

## Data Privacy
Your tracking data, routines, and expenses do not get uploaded to the cloud or tracked by external servers. Everything resides locally within your browser. You can export your data as JSON via the **Settings** view to establish your own backups.
