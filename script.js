document.addEventListener('DOMContentLoaded', () => {

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
  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      // for accessibility, update aria-expanded on the toggle
      const expanded = sidebar.classList.contains('collapsed') ? 'false' : 'true';
      menuToggle.setAttribute('aria-expanded', expanded);
    });
  }

  // 2) Theme toggle (dark mode)
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
    });
  }

  // 3) Search filtering (by title)
  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = searchInput.value.trim().toLowerCase();
      filterVideos(q);
    });

    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim().toLowerCase();
      if (q === '') {
        const activeCat = document.querySelector('.cat-btn.active')?.dataset.cat || 'all';
        filterByCategory(activeCat);
      } else {
        filterVideos(q);
      }
    });
  }

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

      const cat = btn.dataset.cat;
      chips.forEach(c => c.classList.toggle('active', c.dataset.cat === cat));

      filterByCategory(cat);
    });

    // keyboard support
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });

  // 5) Top chips (horizontal)
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

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

  // 6) Video modal player
  const modal = document.getElementById('videoModal');
  const modalIframe = modal?.querySelector('iframe');
  const modalClose = modal?.querySelector('.modal-close');
  const theaterToggle = document.getElementById('theater-toggle');
  const miniToggle = document.getElementById('mini-toggle');

  if (modal && modalIframe) {
    document.querySelectorAll('.thumbnail img').forEach(img => {
      img.addEventListener('click', () => {
        modalIframe.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?si=krFLJhD6_nM0hq3V';
        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');
        modal.classList.remove('theater', 'miniplayer');
      });
    });

    modalClose?.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    function closeModal() {
      modal.style.display = 'none';
      modalIframe.src = '';
      modal.setAttribute('aria-hidden', 'true');
    }

    // THEATER MODE toggle
    theaterToggle?.addEventListener('click', () => {
      modal.classList.toggle('theater');
      if (modal.classList.contains('theater')) {
        modal.classList.remove('miniplayer');
      }
    });

    // MINI PLAYER toggle
    miniToggle?.addEventListener('click', () => {
      modal.classList.toggle('miniplayer');
      if (modal.classList.contains('miniplayer')) {
        modal.classList.remove('theater');
      }
    });

    // ESC exits mini if active, else closes modal
    document.addEventListener('keydown', (e) => {
      if (modal.style.display === 'flex' && e.key === 'Escape') {
        if (modal.classList.contains('miniplayer')) {
          modal.classList.remove('miniplayer');
        } else {
          closeModal();
        }
      }
    });
  }

  // 7) Thumbnail badges (LIVE/HD/CC)
  document.querySelectorAll('.video').forEach(card => {
    const title = card.querySelector('.title')?.textContent.toLowerCase() || '';
    const views = card.querySelector('.views')?.textContent.toLowerCase() || '';
    const thumb = card.querySelector('.thumbnail');
    if (!thumb) return;

    // live badge
    if (views.includes('live')) {
      const b = document.createElement('span');
      b.className = 'badge live';
      b.textContent = 'LIVE';
      thumb.appendChild(b);
    }

    // cc badge (education category)
    const cat = card.getAttribute('data-category') || '';
    if (cat === 'education') {
      const cc = document.createElement('span');
      cc.className = 'badge cc';
      cc.textContent = 'CC';
      thumb.appendChild(cc);
    }

    // hd badge (>100k views)
    const match = views.match(/([0-9]+\.?[0-9]*)\s*(k|m)/i);
    if (match) {
      const value = parseFloat(match[1]);
      const unit = match[2].toLowerCase();
      const approx = unit === 'm' ? value * 1_000_000 : value * 1_000;
      if (approx >= 100_000) {
        const hd = document.createElement('span');
        hd.className = 'badge hd';
        hd.textContent = 'HD';
        thumb.appendChild(hd);
      }
    }
  });

});

