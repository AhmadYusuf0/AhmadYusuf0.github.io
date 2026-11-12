(() => {
  const gallery = document.querySelector('.project-spiral');
  const dialog = document.querySelector('.project-dialog');
  if (!('IntersectionObserver' in window) || typeof dialog.showModal !== 'function') return;

  const layout = gallery.closest('.isotope-layout');
  const stage = gallery.querySelector('.project-spiral-stage');
  const filters = [...layout.querySelectorAll('.portfolio-filters [data-filter]')];
  const close = dialog.querySelector('.project-dialog-close');
  const site = dialog.querySelector('.project-dialog-site');
  const imageButton = dialog.querySelector('.project-dialog-zoom');
  const image = dialog.querySelector('.project-dialog-image img');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const projects = [...layout.querySelectorAll('.portfolio-item')].map((item) => {
    const cover = document.createElement('button');
    const thumbnail = item.querySelector(':scope > img').cloneNode();
    const label = document.createElement('span');
    label.className = 'project-spiral-label';
    cover.type = 'button';
    cover.className = 'project-spiral-cover';
    thumbnail.draggable = false;
    cover.append(thumbnail, label);
    stage.append(cover);
    const project = { item, cover, label, title: item.querySelector('.portfolio-info h4') };
    cover.addEventListener('click', () => openProject(project));
    return project;
  });

  let shown = projects;
  let activeProject;
  let rotation = 0;
  let scrollOffset = 0;
  let previousTime = 0;
  let frame = 0;
  let visible = false;
  let hovering = false;
  let focused = false;
  let touchPaused = false;

  function render(time) {
    frame = 0;
    if (reducedMotion.matches) return;
    const paused = hovering || focused || touchPaused || dialog.open;
    const bounds = gallery.getBoundingClientRect();
    if (!paused) {
      scrollOffset = (innerHeight / 2 - bounds.top - bounds.height / 2) / (innerHeight + bounds.height);
      if (visible && previousTime) rotation += Math.min(time - previousTime, 50) * .00024;
    }
    previousTime = visible && !paused ? time : 0;
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    const cardWidth = Math.max(124, Math.min(width * .27, 224));
    const perspectiveScale = 850 / (850 - 65);
    const cardHalfHeight = cardWidth * .75 * perspectiveScale / 2;
    const travel = height * .065;
    const rowLimit = (shown.length - 1) / 2;
    const spacing = Math.min(height * .095, (height / 2 - cardHalfHeight - travel - 18) / Math.max(1, rowLimit));
    const spread = Math.min(.4, .36 + Math.max(0, width - 768) / 12000);
    const radius = Math.min(width * spread, (width / perspectiveScale - cardWidth) / 2 - 12);
    shown.forEach(({ cover }, index) => {
      const row = index - (shown.length - 1) / 2;
      const angle = row * .83 + rotation + scrollOffset * 7;
      const zigzag = (2 / Math.PI) * Math.asin(Math.sin(angle));
      const x = zigzag * radius;
      const y = row * spacing - Math.max(-1, Math.min(1, scrollOffset * 2)) * travel;
      const depth = Math.cos(angle);
      cover.style.zIndex = String(Math.round((depth + 1) * 100));
      cover.style.transform = `translate3d(${x}px, ${y}px, ${depth * 65}px) rotateY(${Math.sin(angle) * 32}deg) scale(${.86 + depth * .12})`;
    });
    if (visible && !paused) schedule();
  }

  function schedule() {
    if (!frame && !reducedMotion.matches) frame = requestAnimationFrame(render);
  }

  function updateLabels() {
    const id = document.documentElement.lang === 'id';
    projects.forEach(({ label, title }) => { label.textContent = title.textContent.trim(); });
    close.textContent = id ? 'Tutup' : 'Close';
    site.textContent = id ? 'Kunjungi situs' : 'Visit website';
    const enlarged = imageButton.getAttribute('aria-expanded') === 'true';
    imageButton.querySelector('span').textContent = enlarged
      ? (id ? 'Perkecil gambar' : 'Reduce image')
      : (id ? 'Perbesar gambar' : 'Enlarge image');
    imageButton.querySelector('i').className = enlarged ? 'bi bi-zoom-out' : 'bi bi-zoom-in';
  }

  function openProject(project) {
    activeProject = project;
    const { item, title } = project;
    const external = item.querySelector('.details-link');
    dialog.querySelector('#project-dialog-title').textContent = title.textContent;
    dialog.querySelector('.project-dialog-description').textContent = item.querySelector('.portfolio-info p').innerText || item.querySelector('.portfolio-info p').textContent;
    image.src = item.querySelector('.preview-link').href;
    image.alt = title.textContent.trim();
    imageButton.setAttribute('aria-expanded', 'false');
    site.hidden = !external;
    if (external) site.href = external.href;
    else site.removeAttribute('href');
    updateLabels();
    dialog.showModal();
    schedule();
  }

  filters.forEach((filter) => filter.querySelector('button').addEventListener('click', () => {
    shown = projects.filter(({ item, cover }) => {
      const matches = item.matches(filter.dataset.filter);
      cover.hidden = !matches;
      return matches;
    });
    filters.forEach((option) => {
      option.classList.toggle('filter-active', option === filter);
      option.querySelector('button').setAttribute('aria-pressed', String(option === filter));
    });
    schedule();
  }));

  gallery.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse' || event.pointerType === 'pen') hovering = true;
    schedule();
  });
  gallery.addEventListener('pointerleave', () => {
    hovering = false;
    schedule();
  });
  gallery.addEventListener('focusin', (event) => {
    focused = event.target.matches(':focus-visible');
    schedule();
  });
  gallery.addEventListener('focusout', () => {
    focused = false;
    schedule();
  });
  gallery.addEventListener('pointerup', (event) => {
    if (event.pointerType === 'touch' && !event.target.closest('button')) {
      touchPaused = !touchPaused;
      schedule();
    }
  });
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    activeProject.cover.focus({ preventScroll: true });
    schedule();
  });
  imageButton.addEventListener('click', () => {
    imageButton.setAttribute('aria-expanded', String(imageButton.getAttribute('aria-expanded') !== 'true'));
    updateLabels();
  });
  document.addEventListener('portfolio:language-change', updateLabels);
  reducedMotion.addEventListener('change', () => {
    previousTime = 0;
    schedule();
  });
  window.addEventListener('resize', schedule);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    previousTime = 0;
    schedule();
  }).observe(gallery);

  updateLabels();
  layout.classList.add('spiral-enabled');
  gallery.hidden = false;
  schedule();
})();
