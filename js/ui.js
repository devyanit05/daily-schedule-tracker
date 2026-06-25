function applyTheme() {
  document.documentElement.classList.toggle('light-theme', !settings.darkMode);
}

function renderDate() {
  const now = new Date();
  $('current-date').textContent = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  $('current-day').textContent = now.toLocaleDateString('en-US', { weekday: 'long' });
}

function renderGreeting() {
  const h = new Date().getHours();
  let g = h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : h < 21 ? 'Good Evening' : 'Good Night';
  let icon = h < 12 ? '☀️' : h < 17 ? '🌤️' : h < 21 ? '🌅' : '🌙';
  let name = settings.userName ? `, ${settings.userName}` : '';
  $('greeting').textContent = `${g}${name} ${icon}`;
}

function renderMotivation() {
  $('motivation-quote').textContent = QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

function showToast(icon, title, msg) {
  const container = $('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-content">
      <strong>${title}</strong>
      <p>${msg}</p>
    </div>
  `;
  const closeBtn = document.createElement('button');
  closeBtn.className = 'toast-close';
  closeBtn.textContent = '✕';
  closeBtn.addEventListener('click', () => toast.remove());
  toast.appendChild(closeBtn);
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 7000);
}

function launchConfetti() {
  const canvas = $('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const colors = ['#7c3aed','#06b6d4','#10b981','#f59e0b','#ef4444','#ec4899','#8b5cf6'];
  const particles = Array.from({ length: 140 }, () => ({
    x: Math.random() * canvas.width, y: Math.random() * canvas.height - canvas.height,
    w: Math.random() * 10 + 5, h: Math.random() * 6 + 3,
    color: colors[Math.floor(Math.random() * colors.length)],
    vx: (Math.random() - 0.5) * 4, vy: Math.random() * 3 + 2,
    rot: Math.random() * 360, rotV: (Math.random() - 0.5) * 10, opacity: 1
  }));
  let frame = 0;
  const max = 180;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot * Math.PI / 180);
      ctx.globalAlpha = p.opacity; ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
      p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.rot += p.rotV;
      if (frame > max * 0.6) p.opacity -= 0.02;
    });
    frame++;
    if (frame < max) requestAnimationFrame(animate);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  animate();
}
