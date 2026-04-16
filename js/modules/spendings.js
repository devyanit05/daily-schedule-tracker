function initFinanceModule() {
  if (!financeState.subscriptions) financeState.subscriptions = [];
  if (typeof financeState.travelMode === 'undefined') financeState.travelMode = false;

  setupFinanceTabs();
  setupExpenseForm();
  setupGoalsForm();
  populateExpenseCategories();
  setupBankCSVImport();
  setupTravelMode();
  setupSubs();
  
  // Render views
  renderFinanceLog();
  renderFinanceBudget();
  renderFinanceGoals();
  renderSubscriptions();
}

function setupFinanceTabs() {
  document.querySelectorAll('[data-tab]').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('[data-tab]').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('#section-spendings .finance-view').forEach(v => v.classList.add('hidden'));
      document.querySelectorAll('#section-spendings .finance-view').forEach(v => v.classList.remove('active'));
      
      const v = $('finance-view-' + tab.dataset.tab);
      if (v) {
        v.classList.remove('hidden');
        v.classList.add('active');
      }
      
      if (tab.dataset.tab === 'budget') { renderFinanceBudget(); setTimeout(renderBurnRateChart, 50); }
      if (tab.dataset.tab === 'goals') renderFinanceGoals();
      if (tab.dataset.tab === 'subs') renderSubscriptions();
      if (tab.dataset.tab === 'investments') setTimeout(renderCompoundChart, 50);
    });
  });
}

function populateExpenseCategories() {
  const sel = $('expense-category');
  if (!sel) return;
  sel.innerHTML = '';
  Object.keys(EXPENSE_LABELS).forEach(k => {
    const opt = document.createElement('option');
    opt.value = k;
    opt.textContent = `${EXPENSE_ICONS[k] || ''} ${EXPENSE_LABELS[k]}`;
    sel.appendChild(opt);
  });
}

function setupTravelMode() {
  const tm = $('travel-mode-toggle');
  if (tm) {
    tm.checked = financeState.travelMode;
    tm.addEventListener('change', () => {
      financeState.travelMode = tm.checked;
      save(FINANCE_KEY, financeState);
      showToast('✈️', 'Travel Mode', tm.checked ? 'Active! New expenses go to Trip Vault instead of monthly budget.' : 'Deactivated.');
      renderFinanceLog();
      renderFinanceBudget();
    });
  }
}

function setupBankCSVImport() {
  const uploadBtn = $('bank-csv-upload');
  if (!uploadBtn) return;
  uploadBtn.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      const lines = text.split('\n');
      let count = 0;
      const today = getTodayData();
      
      lines.forEach(l => {
        const line = l.toLowerCase();
        let cat = 'other';
        let amount = 0;
        let desc = line.split(',')[0] || 'Bank Transaction';
        
        if (line.includes('amazon') || line.includes('flipkart') || line.includes('d-mart')) cat = 'shopping';
        else if (line.includes('uber') || line.includes('ola') || line.includes('irctc') || line.includes('flight')) cat = 'transport';
        else if (line.includes('zomato') || line.includes('swiggy') || line.includes('restaurant')) cat = 'food';
        else if (line.includes('netflix') || line.includes('spotify') || line.includes('aws')) cat = 'entertainment';

        const match = line.match(/\d+(\.\d{1,2})?/); // naive amount extract
        if (match) amount = parseFloat(match[0]);
        
        if (amount > 0 && amount < 100000) {
           today.expenses.push({ 
             description: desc.substring(0,25), 
             amount, 
             category: cat, 
             isTrip: financeState.travelMode,
             createdAt: new Date().toISOString() 
           });
           count++;
        }
      });
      save(DATA_KEY, appData);
      renderFinanceLog();
      renderFinanceBudget();
      $('csv-preview-container').textContent = `Imported ${count} transactions successfully!`;
      $('csv-preview-container').classList.remove('hidden');
      $('csv-preview-container').style.color = 'var(--success)';
      showToast('✅', 'Bank CSV Imported', `Auto-categorized ${count} transactions!`);
    };
    reader.readAsText(file);
  });
}

function renderFinanceLog() {
  const today = getTodayData();
  const list = $('expense-list');
  const empty = $('spendings-empty');
  if(!list) return;

  list.innerHTML = '';
  if (today.expenses.length === 0) {
    list.style.display = 'none';
    if(empty) empty.classList.remove('hidden');
  } else {
    list.style.display = 'flex';
    if(empty) empty.classList.add('hidden');

    today.expenses.forEach((exp, idx) => {
      const el = document.createElement('div');
      el.className = 'expense-item';
      if (exp.isTrip) el.style.borderLeft = "4px solid #f59e0b"; // indicator for trip vault
      
      el.innerHTML = `
        <div class="expense-cat-badge">${EXPENSE_ICONS[exp.category] || '📌'}</div>
        <div class="expense-info">
          <div class="expense-desc">${escapeHTML(exp.description)} ${exp.isTrip ? '<span style="font-size:0.7rem;color:#f59e0b;">(Trip Vault)</span>' : ''}</div>
          <div class="expense-cat-label">${EXPENSE_LABELS[exp.category] || exp.category}</div>
        </div>
        <div class="expense-amount">₹${formatNumber(exp.amount)}</div>
      `;

      const del = document.createElement('button');
      del.className = 'expense-delete';
      del.innerHTML = '🗑️';
      del.addEventListener('click', () => {
        today.expenses.splice(idx, 1);
        save(DATA_KEY, appData);
        renderFinanceLog();
        renderFinanceBudget();
        if (typeof updateSidebarStats === 'function') updateSidebarStats();
      });
      el.appendChild(del);
      list.appendChild(el);
    });
  }

  const total = today.expenses.reduce((s, e) => s + (e.amount || 0), 0);
  if($('total-spent')) $('total-spent').innerHTML = '₹' + formatNumber(total);
  const side = $('sidebar-spend-stat');
  if (side) side.textContent = '₹' + formatNumber(total);
}

function setupExpenseForm() {
  const form = $('expense-form');
  const addBtns = [$('btn-add-expense'), $('btn-add-first-expense')];
  addBtns.forEach(b => b && b.addEventListener('click', () => {
    if(form) form.classList.remove('hidden');
    $('expense-desc').value = '';
    $('expense-amount').value = '';
    setTimeout(() => { if($('expense-desc')) $('expense-desc').focus() }, 100);
  }));

  if($('btn-cancel-expense')) $('btn-cancel-expense').addEventListener('click', () => form.classList.add('hidden'));
  if($('btn-save-expense')) $('btn-save-expense').addEventListener('click', addExpense);
  if($('expense-desc')) $('expense-desc').addEventListener('keydown', e => { if (e.key === 'Enter') addExpense(); });
  if($('expense-amount')) $('expense-amount').addEventListener('keydown', e => { if (e.key === 'Enter') addExpense(); });
}

function addExpense() {
  const desc = $('expense-desc').value.trim();
  const amount = parseFloat($('expense-amount').value);
  const cat = $('expense-category').value;

  if (!desc) { $('expense-desc').style.borderColor = 'var(--danger)'; setTimeout(() => $('expense-desc').style.borderColor = '', 1200); return; }
  if (isNaN(amount) || amount <= 0) { $('expense-amount').style.borderColor = 'var(--danger)'; setTimeout(() => $('expense-amount').style.borderColor = '', 1200); return; }

  const today = getTodayData();
  // check travel mode
  today.expenses.push({ 
    description: desc, 
    amount, 
    category: cat, 
    isTrip: financeState.travelMode,
    createdAt: new Date().toISOString() 
  });
  
  save(DATA_KEY, appData);
  renderFinanceLog();
  renderFinanceBudget();
  if (typeof updateSidebarStats === 'function') updateSidebarStats();
  $('expense-form').classList.add('hidden');
}

function getMonthlyExpenses() {
  const now = new Date();
  const prefix = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2, '0')}`;
  
  let catTotals = {};
  let totalSpent = 0;
  let tripVaultTotal = 0;

  Object.keys(appData).forEach(dateKey => {
    if (dateKey.startsWith(prefix) && appData[dateKey].expenses) {
      appData[dateKey].expenses.forEach(e => {
        if (e.isTrip) {
           tripVaultTotal += e.amount;
        } else {
           catTotals[e.category] = (catTotals[e.category] || 0) + e.amount;
           totalSpent += e.amount;
        }
      });
    }
  });

  return { totals: catTotals, totalSum: totalSpent, tripVaultTotal };
}

function renderFinanceBudget() {
  if (!$('monthly-budget-list')) return;
  const { totals, totalSum } = getMonthlyExpenses();
  const income = financeState.monthlyIncome;
  
  if($('stat-income')) $('stat-income').textContent = '₹' + formatNumber(income);
  if($('stat-spent-month')) $('stat-spent-month').textContent = '₹' + formatNumber(totalSum);
  const left = income - totalSum;
  
  const sl = $('stat-remaining');
  if(sl) {
    sl.textContent = '₹' + formatNumber(left);
    sl.style.color = left < 0 ? 'var(--danger)' : 'var(--primary)';
  }

  const list = $('monthly-budget-list');
  list.innerHTML = '';
  
  let highestOffender = { name: '', amt: 0 };
  
  Object.keys(financeState.budgets).forEach(cat => {
    const limit = financeState.budgets[cat];
    const spent = totals[cat] || 0;
    const pct = Math.min((spent / limit) * 100, 100) || 0;
    const isOver = spent > limit;
    
    if (isOver && (spent - limit) > highestOffender.amt) {
      highestOffender = { name: EXPENSE_LABELS[cat], amt: spent - limit };
    }

    const html = `
      <div class="budget-item" style="margin-bottom:12px; background:var(--card-bg); padding:10px; border-radius:8px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:5px; font-size:0.9rem;">
          <span>${EXPENSE_ICONS[cat]||''} ${EXPENSE_LABELS[cat]||cat}</span>
          <span style="color:${isOver ? 'var(--danger)' : 'var(--text-color)'}">
            ₹${formatNumber(spent)} / ₹${formatNumber(limit)}
          </span>
        </div>
        <div class="summary-bar">
          <div class="summary-bar-fill" style="width:${pct}%; background:${isOver?'var(--danger)':'var(--primary)'}"></div>
        </div>
      </div>
    `;
    list.innerHTML += html;
  });

  const sugBox = $('budget-suggestion-text');
  if(sugBox) {
    if (left < 0) {
      sugBox.textContent = `Warning: You have exceeded your monthly income by ₹${formatNumber(-left)}! Time to halt non-essential spending immediately.`;
      sugBox.parentElement.style.borderLeftColor = 'var(--danger)';
    } else if (highestOffender.amt > 0) {
      sugBox.textContent = `Watch out! You overspent on ${highestOffender.name} by ₹${formatNumber(highestOffender.amt)}. Consider recovering money from your unused Entertainment or Shopping budgets.`;
      sugBox.parentElement.style.borderLeftColor = 'var(--danger)';
    } else if (left < income * 0.1) {
      sugBox.textContent = `You're nearing your strict limits. Try avoiding unnecessary dining out or shopping for the rest of the month.`;
      sugBox.parentElement.style.borderLeftColor = '#f59e0b';
    } else {
      sugBox.textContent = `You are on track this month! Keep following the budget layout for long term wealth.`;
      sugBox.parentElement.style.borderLeftColor = 'var(--success)';
    }
  }
}

// ============== CHART JS INTEGRATIONS ==============
let burnRateChartInst = null;
function renderBurnRateChart() {
  const ctx = document.getElementById('burn-rate-chart');
  if (!ctx || typeof Chart === 'undefined') return;
  if (burnRateChartInst) burnRateChartInst.destroy();
  
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const currentDay = new Date().getDate();
  const { totalSum } = getMonthlyExpenses();
  const totalBudget = Object.values(financeState.budgets).reduce((a, b) => a + b, 0) || 50000;
  
  const idealPace = [];
  const actualPace = [];
  
  for (let i = 1; i <= daysInMonth; i++) {
     idealPace.push((totalBudget / daysInMonth) * i);
     if (i <= currentDay) {
        // Linearly smooth the spent to current day
        actualPace.push((totalSum / currentDay) * i);
     }
  }

  burnRateChartInst = new Chart(ctx, {
    type: 'line',
    data: {
      labels: Array.from({length: daysInMonth}, (_, i) => i + 1),
      datasets: [
        { label: 'Ideal Pace', data: idealPace, borderColor: '#10b981', borderDash: [5, 5], fill: false, tension: 0 },
        { label: 'Actual Spent', data: actualPace, borderColor: '#ef4444', fill: true, backgroundColor: 'rgba(239, 68, 68, 0.1)', tension: 0 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: true, labels: { color: 'gray' } } },
      scales: { x: { display: false }, y: { display: false } }
    }
  });

  // Calculate predictive warning dynamically:
  const predictedEnd = (totalSum / currentDay) * daysInMonth;
  if (predictedEnd > totalBudget) {
     const sugBox = $('budget-suggestion-text');
     if(sugBox) {
       sugBox.innerHTML = `<strong>AI Forecast:</strong> Based on your current burn rate, you will exceed your entire budget by ₹${formatNumber(predictedEnd - totalBudget)} before the month is over. Slow down!`;
       sugBox.parentElement.style.borderLeftColor = 'var(--danger)';
     }
  }
}

let compoundChartInst = null;
function renderCompoundChart() {
  const ctx = document.getElementById('compound-chart');
  if (!ctx || typeof Chart === 'undefined') return;
  if (compoundChartInst) compoundChartInst.destroy();
  
  // They mentioned 12.5k fixed + 2k PPF = 14.5k monthly invest
  const PMT = 14500;
  const r = 0.12; 
  const labels = [];
  const principalData = [];
  const interestData = [];
  
  let principal = 0;
  let totalSaved = 0;
  
  for (let year = 1; year <= 10; year++) {
     labels.push('Year ' + year);
     principal += PMT * 12;
     // simple compound proxy
     totalSaved = (totalSaved + PMT * 12) * (1 + r);
     
     principalData.push(principal);
     interestData.push(totalSaved - principal);
  }

  compoundChartInst = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        { label: 'Saved Cash', data: principalData, backgroundColor: '#3b82f6' },
        { label: 'Compound Interest', data: interestData, backgroundColor: '#10b981' }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: {
        x: { stacked: true, ticks: {color: 'gray'} },
        y: { stacked: true, display: false }
      },
      plugins: { legend: { display: true, labels: {color: 'gray'} } }
    }
  });
}

// ============== SUBSCRIPTIONS ==============
function setupSubs() {
  const addBtn = $('btn-add-sub');
  if(!addBtn) return;
  addBtn.addEventListener('click', () => {
     const name = prompt("Enter subscription name (e.g. Netflix, Gym):");
     if (!name) return;
     const amt = parseFloat(prompt("Enter monthly cost:"));
     if (isNaN(amt)) return;
     financeState.subscriptions.push({ name, amount: amt });
     save(FINANCE_KEY, financeState);
     renderSubscriptions();
  });
}

function renderSubscriptions() {
  const list = $('subs-list');
  if (!list) return;
  list.innerHTML = '';
  
  let totalSubs = 0;
  financeState.subscriptions.forEach((sub, idx) => {
    totalSubs += sub.amount;
    const el = document.createElement('div');
    el.style = `display:flex; justify-content:space-between; background:var(--card-bg); padding:10px; margin-bottom:10px; border-radius:8px;`;
    el.innerHTML = `
      <span>💸 ${escapeHTML(sub.name)}</span>
      <strong>₹${formatNumber(sub.amount)}</strong>
    `;
    const btn = document.createElement('button');
    btn.innerHTML = '✕'; btn.className = 'btn btn-secondary btn-sm';
    btn.onclick = () => { financeState.subscriptions.splice(idx,1); save(FINANCE_KEY, financeState); renderSubscriptions(); };
    el.appendChild(btn);
    list.appendChild(el);
  });
  
  if (financeState.subscriptions.length === 0) {
    list.innerHTML = `<p style="color:var(--text-muted); text-align:center;">No ghost subscriptions draining your money! ❤️</p>`;
  }
  
  // Alert if > 5% of 50,000 (which is 2500)
  const warn = $('subs-ai-warning');
  if (warn) {
    if (totalSubs > (financeState.monthlyIncome * 0.05)) {
       warn.style.display = 'block';
       warn.innerHTML = `<strong>⚠️ Ghost Subs Alert:</strong> You are spending ₹${formatNumber(totalSubs)}/mo on passive subscriptions! This is >5% of your income. Cancel unused services.`;
    } else {
       warn.style.display = 'none';
    }
  }
}

// ============== GOALS AND TRIPS ==============
function renderFinanceGoals() {
  const list = $('goals-list');
  if (!list) return;
  list.innerHTML = '';
  
  if (financeState.upcoming.length === 0) {
    list.innerHTML = `<p style="color:var(--text-muted);text-align:center;">No upcoming trips or big expenses. Add one to start saving!</p>`;
  } else {
    financeState.upcoming.forEach((g, idx) => {
      const el = document.createElement('div');
      el.className = 'goal-card';
      el.style = `background:var(--card-bg); border-radius:8px; padding:15px; margin-bottom:10px; border-left:4px solid var(--primary);`;
      
      let sugMessage = "";
      if (g.date) {
          const d = new Date(g.date);
          const now = new Date();
          let months = (d.getFullYear() - now.getFullYear()) * 12 + d.getMonth() - now.getMonth();
          if (months <= 0) months = 1;
          const requiredPerMonth = Math.ceil(g.target / months);
          sugMessage = `<div style="font-size:0.85rem; color:#f59e0b; margin-top:8px;">
            💡 Suggestion: Save ₹${formatNumber(requiredPerMonth)}/month for this.
          </div>`;
      }
  
      el.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <h4 style="margin:0; font-size:1rem;">${escapeHTML(g.name)} ${financeState.travelMode ? '<span style="font-size:0.7rem;color:#f59e0b;">(Travel Mode Active)</span>' : ''}</h4>
          <span style="font-weight:bold; color:var(--primary);">₹${formatNumber(g.target)}</span>
        </div>
        <div style="font-size:0.85rem; color:var(--text-muted); margin-top:4px;">Target: ${g.date || 'No Date'}</div>
        ${sugMessage}
        <button class="btn btn-secondary btn-sm" style="margin-top:10px; padding:4px 8px;" onclick="deleteGoal(${idx})">🗑️ Delete</button>
      `;
      list.appendChild(el);
    });
  }
  
  // Render Trip Vault Mini-ledger
  const { tripVaultTotal } = getMonthlyExpenses();
  if (tripVaultTotal > 0) {
     const vault = document.createElement('div');
     vault.style = `margin-top: 20px; background: rgba(245, 158, 11, 0.1); border: 2px dashed #f59e0b; border-radius: 8px; padding: 15px;`;
     vault.innerHTML = `<h4 style="margin:0 0 10px 0; color: #f59e0b;">🌴 Trip Vault Spending</h4>
     <p style="font-size:0.9rem; margin:0;">Total Spent on Trips so far this month: <strong>₹${formatNumber(tripVaultTotal)}</strong></p>
     <p style="font-size:0.8rem; color:gray; margin-top:5px;">(This amount is hidden from your main budget analytics!)</p>
     `;
     list.appendChild(vault);
  }
}

function setupGoalsForm() {
  const addBtn = $('btn-add-goal');
  const form = $('add-goal-form');
  if(!addBtn) return;
  
  addBtn.addEventListener('click', () => form.classList.remove('hidden'));
  $('btn-cancel-goal').addEventListener('click', () => form.classList.add('hidden'));
  
  $('btn-save-goal').addEventListener('click', () => {
    const name = $('goal-name').value.trim();
    const target = parseFloat($('goal-target').value);
    const date = $('goal-date').value;
    
    if (!name || isNaN(target)) {
       $('goal-name').focus();
       return;
    }
    
    financeState.upcoming.push({ name, target, date });
    save(FINANCE_KEY, financeState);
    $('goal-name').value = '';
    $('goal-target').value = '';
    $('goal-date').value = '';
    form.classList.add('hidden');
    renderFinanceGoals();
  });
}

window.deleteGoal = function(idx) {
  financeState.upcoming.splice(idx, 1);
  save(FINANCE_KEY, financeState);
  renderFinanceGoals();
}
