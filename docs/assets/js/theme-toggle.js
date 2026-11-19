(() => {
  const root = document.documentElement;
  const button = document.getElementById('theme-toggle');
  const system = matchMedia('(prefers-color-scheme: dark)');
  let saved;
  try { saved = localStorage.getItem('portfolio-theme'); } catch {}
  function apply(dark) {
    root.dataset.theme = dark ? 'dark' : 'light';
    button.setAttribute('aria-pressed', String(dark));
    button.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    button.querySelector('i').className = dark ? 'bi bi-sun' : 'bi bi-moon';
  }
  apply(saved ? saved === 'dark' : system.matches);
  system.addEventListener('change', () => { if (!saved) apply(system.matches); });
  let changing = false;
  button.addEventListener('click', async () => {
    if (changing) return;
    const dark = root.dataset.theme !== 'dark';
    const update = () => {
      apply(dark);
      saved = dark ? 'dark' : 'light';
      try { localStorage.setItem('portfolio-theme', saved); } catch {}
    };
    if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      update();
      return;
    }
    changing = true;
    const bounds = button.getBoundingClientRect();
    const x = bounds.left + bounds.width / 2;
    const y = bounds.top + bounds.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    try {
      const transition = document.startViewTransition(update);
      await transition.ready;
      root.animate({
        clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`]
      }, { duration: 420, easing: 'ease-out', pseudoElement: '::view-transition-new(root)' });
      await transition.finished;
    } finally { changing = false; }
  });
})();
