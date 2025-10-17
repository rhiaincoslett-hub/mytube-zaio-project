// ELEMENTS
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const themeToggle = document.getElementById('theme-toggle');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const videos = Array.from(document.querySelectorAll('.video'));
const sidebarButtons = Array.from(document.querySelectorAll('.cat-btn'));
const chips = Array.from(document.querySelectorAll('.chip'));

// 1) Sidebar toggle (collapsible)
menuToggle.addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
  // for accessibility, update aria-expanded on the toggle
  const expanded = sidebar.classList.contains('collapsed') ? 'false' : 'true';
  menuToggle.setAttribute('aria-expanded', expanded);
});

// 2) Theme toggle (dark mode)
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// 3) Search filtering (by title)
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const q = searchInput.value.trim().toLowerCase();
  filterVideos(q);
});

searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  if (q === '') {
    // if empty, show according to currently selected category
    const activeCat = document.querySelector('.cat-btn.active')?.dataset.cat || 'all';
    filterByCategory(activeCat);
  } else {
    filterVideos(q);
  }
});

function filterVideos(query) {
  videos.forEach(v => {
    const title = v.querySelector('.title')?.textContent.toLowerCase() || '';
    v.style.display = title.includes(query) ? '' : 'none';
  });
}

// 4) Category buttons (sidebar vertical)
sidebarButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    sidebarButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // sync top chips (if same data-cat)
    const cat = btn.dataset.cat;
    chips.forEach(c => c.classList.toggle('active', c.dataset.cat === cat));

    filterByCategory(cat);
  });

  // keyboard support: Enter/Space should activate
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      btn.click();
    }
  });
});

// 5) Top chips (horizontal) — also filter
chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');

    // sync sidebar: find sidebar button with same data-cat
    const target = sidebarButtons.find(b => b.dataset.cat === chip.dataset.cat);
    sidebarButtons.forEach(b => b.classList.remove('active'));
    if (target) target.classList.add('active');

    filterByCategory(chip.dataset.cat);
  });
});

function filterByCategory(cat) {
  if (!cat || cat === 'all') {
    videos.forEach(v => v.style.display = '');
    return;
  }
  videos.forEach(v => {
    const vcat = v.dataset.category || '';
    v.style.display = vcat === cat ? '' : 'none';
  });
}

// 6) Video modal player (opens on thumbnail click)
const modal = document.getElementById('videoModal');
const modalIframe = modal.querySelector('iframe');
const modalClose = modal.querySelector('.modal-close');

document.querySelectorAll('.thumbnail img').forEach(img => {
  img.addEventListener('click', (e) => {
    // For demo, embed a sample video. In real project, set per-video url via data attribute
    modalIframe.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?si=krFLJhD6_nM0hq3V';
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
  });
});

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});
function closeModal() {
  modal.style.display = 'none';
  modalIframe.src = '';
  modal.setAttribute('aria-hidden', 'true');
}

