function $(id) { return document.getElementById(id); }

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function formatNumber(n) {
  return n.toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

function formatTime12(time24) {
  const [h, m] = time24.split(':');
  const hr = parseInt(h);
  const ampm = hr >= 12 ? 'PM' : 'AM';
  const hr12 = hr % 12 || 12;
  return `${hr12}:${m} ${ampm}`;
}
