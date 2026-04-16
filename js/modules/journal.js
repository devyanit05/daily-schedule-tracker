function renderJournal() {
  const today = getTodayData();
  const textarea = $('journal-textarea');
  textarea.value = today.journal || '';
  $('journal-char-count').textContent = (today.journal || '').length + ' characters';
  $('journal-time').textContent = '';

  textarea.addEventListener('input', () => {
    const val = textarea.value;
    $('journal-char-count').textContent = val.length + ' characters';
    // Debounced auto-save
    clearTimeout(journalSaveTimer);
    $('journal-saved').classList.remove('show');
    journalSaveTimer = setTimeout(() => {
      getTodayData().journal = val;
      save(DATA_KEY, appData);
      const indicator = $('journal-saved');
      indicator.classList.add('show');
      $('journal-time').textContent = 'Last saved: ' + new Date().toLocaleTimeString();
      setTimeout(() => indicator.classList.remove('show'), 2000);
    }, 600);
  });

  // Prompts
  document.querySelectorAll('.journal-prompt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const prompt = btn.dataset.prompt;
      const current = textarea.value;
      const sep = current.length > 0 ? '\n\n' : '';
      textarea.value = current + sep + '### ' + prompt + '\n';
      textarea.focus();
      textarea.selectionStart = textarea.value.length;
      textarea.dispatchEvent(new Event('input'));
    });
  });
}
