function initCareerModule() {
  renderCareerChecklist();
  setupJobTabs();
  setupPracticeWidget();
  setupMockInterview();
  setupEnglishPractice();
}

function setupJobTabs() {
  document.querySelectorAll('[data-job-tab]').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('[data-job-tab]').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      document.querySelectorAll('.job-view').forEach(v => {
        v.classList.remove('active');
        v.classList.add('hidden');
      });
      
      const v = $('job-view-' + tab.dataset.jobTab);
      if (v) {
        v.classList.remove('hidden');
        v.classList.add('active');
      }
    });
  });
}

function renderCareerChecklist() {
  const list = $('career-checklist');
  if (!list) return;
  list.innerHTML = '';
  let doneCount = 0;

  CAREER_MILESTONES.forEach(item => {
    const isChecked = !!careerChecks[item.id];
    if (isChecked) doneCount++;

    const el = document.createElement('div');
    el.className = 'career-item' + (isChecked ? ' completed' : '');
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = isChecked;
    cb.className = 'routine-checkbox';
    cb.addEventListener('change', () => {
      careerChecks[item.id] = !isChecked;
      save(CAREER_CHECKLIST_KEY, careerChecks);
      renderCareerChecklist();
    });

    const name = document.createElement('span');
    name.className = 'career-name';
    name.textContent = item.title;

    el.appendChild(cb);
    el.appendChild(name);
    list.appendChild(el);
  });

  if($('career-done')) $('career-done').textContent = doneCount;
  if($('career-total')) $('career-total').textContent = CAREER_MILESTONES.length;
}

function setupPracticeWidget() {
  const tEl = $('practice-topic');
  const qEl = $('practice-question');
  const aEl = $('practice-answer');
  const showBtn = $('btn-show-answer');
  const nextBtn = $('btn-next-question');
  if (!qEl) return;

  function pickRandom() {
    const idx = Math.floor(Math.random() * PRACTICE_QUESTIONS.length);
    const currentQ = PRACTICE_QUESTIONS[idx];
    tEl.textContent = currentQ.topic;
    qEl.textContent = currentQ.q;
    aEl.textContent = currentQ.a;
    aEl.classList.add('hidden');
    showBtn.style.display = 'inline-block';
  }

  showBtn.addEventListener('click', () => {
    aEl.classList.remove('hidden');
    showBtn.style.display = 'none';
  });

  nextBtn.addEventListener('click', pickRandom);
  pickRandom();
}

let interviewTimerId = null;
let interviewSeconds = 0;

function setupMockInterview() {
  const qEl = $('interview-question');
  const tEl = $('interview-type');
  const tipsEl = $('interview-tips');
  const tipsList = $('interview-tips-list');
  const nextBtn = $('btn-next-interview');
  const showTipsBtn = $('btn-show-tips');
  const startBtn = $('btn-start-interview');
  const timerDisplay = $('interview-timer');
  
  if(!qEl) return;

  function formatTime(s) {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return String(mins).padStart(2,'0') + ':' + String(secs).padStart(2,'0');
  }

  function pickRandomInterview() {
    // Reset timer
    clearInterval(interviewTimerId);
    interviewTimerId = null;
    interviewSeconds = 0;
    timerDisplay.textContent = formatTime(0);
    startBtn.textContent = 'Start Recording / Timer';
    startBtn.style.background = 'var(--accent-gradient)';
    
    // Set Question
    const idx = Math.floor(Math.random() * MOCK_INTERVIEWS.length);
    const item = MOCK_INTERVIEWS[idx];
    
    tEl.textContent = item.type;
    qEl.textContent = item.q;
    tipsEl.classList.add('hidden');
    
    tipsList.innerHTML = '';
    item.tips.forEach(t => {
       const li = document.createElement('li');
       li.textContent = t;
       li.style.marginBottom = '6px';
       tipsList.appendChild(li);
    });
  }

  startBtn.addEventListener('click', () => {
    if (interviewTimerId) {
      clearInterval(interviewTimerId);
      interviewTimerId = null;
      startBtn.textContent = 'Resume Timer';
      startBtn.style.background = 'var(--border-color)';
    } else {
      startBtn.textContent = 'Pause Timer';
      startBtn.style.background = 'var(--danger)';
      interviewTimerId = setInterval(() => {
        interviewSeconds++;
        timerDisplay.textContent = formatTime(interviewSeconds);
      }, 1000);
    }
  });

  showTipsBtn.addEventListener('click', () => {
    tipsEl.classList.toggle('hidden');
  });

  nextBtn.addEventListener('click', pickRandomInterview);

  pickRandomInterview();
}

function setupEnglishPractice() {
  const tEl = $('english-word');
  const mEl = $('english-meaning');
  const exEl = $('english-example');
  const pEl = $('english-paragraph');
  const nextBtn = $('btn-next-english');
  
  if(!tEl) return;

  function pickRandomEnglish() {
    const idx = Math.floor(Math.random() * ENGLISH_EXERCISES.length);
    const item = ENGLISH_EXERCISES[idx];
    
    tEl.textContent = item.word;
    tEl.previousElementSibling.textContent = item.type + ' of the Day';
    mEl.textContent = item.meaning;
    exEl.textContent = '"' + item.example + '"';
    pEl.textContent = item.para;
  }

  nextBtn.addEventListener('click', pickRandomEnglish);
  
  pickRandomEnglish();
}
