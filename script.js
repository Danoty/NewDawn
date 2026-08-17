(() => {
  const config = window.NEWDawn_CONFIG || {};
  const school = config.school || {};

  const applySiteConfig = () => {
    if (school.parentPortalUrl) {
      document.querySelectorAll('[data-portal-link]').forEach((link) => {
        link.href = school.parentPortalUrl;
      });
    }
    if (school.phoneInternational) {
      document.querySelectorAll('a[href^="tel:"]').forEach((link) => {
        link.href = `tel:${school.phoneInternational}`;
        if (/^\+?\d[\d\s]+$/.test(link.textContent.trim()) && school.phoneDisplay) link.textContent = school.phoneDisplay;
      });
    }
    if (school.email) {
      document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
        link.href = `mailto:${school.email}`;
        if (link.textContent.includes('@')) link.textContent = school.email;
      });
    }
    if (school.whatsappNumber) {
      document.querySelectorAll('a[href*="wa.me/"]').forEach((link) => {
        const url = new URL(link.href);
        const message = url.searchParams.get('text');
        url.pathname = `/${school.whatsappNumber}`;
        if (message) url.searchParams.set('text', message);
        link.href = url.toString();
      });
    }
  };
  applySiteConfig();

  const header = document.querySelector('[data-header]');
  const menu = document.querySelector('[data-menu]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const setHeader = () => header?.classList.toggle('scrolled', window.scrollY > 45);
  setHeader();
  window.addEventListener('scroll', setHeader, { passive: true });

  const setMenu = (open) => {
    menu?.classList.toggle('open', open);
    menuToggle?.classList.toggle('active', open);
    menuToggle?.setAttribute('aria-expanded', String(open));
    menuToggle?.querySelector('.sr-only')?.replaceChildren(document.createTextNode(open ? 'Close menu' : 'Open menu'));
  };
  menuToggle?.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
  });

  const reveals = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((item) => item.classList.add('visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px' });
    reveals.forEach((item) => revealObserver.observe(item));
  }

  const countElements = document.querySelectorAll('[data-count]');
  const showFinalCount = (element) => {
    element.textContent = `${element.dataset.count}${element.dataset.suffix || ''}`;
  };
  if (reduceMotion || !('IntersectionObserver' in window)) {
    countElements.forEach(showFinalCount);
  } else {
    const countObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const element = entry.target;
        const target = Number(element.dataset.count);
        const suffix = element.dataset.suffix || '';
        const start = performance.now();
        const duration = 1100;
        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          element.textContent = `${Math.round(target * eased)}${suffix}`;
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        observer.unobserve(element);
      });
    }, { threshold: 0.7 });
    countElements.forEach((item) => countObserver.observe(item));
  }

  document.querySelector('[data-year]').textContent = new Date().getFullYear();

  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
  }

  const dialog = document.querySelector('[data-dialog]');
  const dialogContent = document.querySelector('[data-dialog-content]');
  const closeDialog = () => {
    dialog?.close();
    dialogContent?.replaceChildren();
  };
  document.querySelector('[data-dialog-close]')?.addEventListener('click', closeDialog);
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) closeDialog();
  });

  document.querySelectorAll('[data-video]').forEach((button) => {
    button.addEventListener('click', () => {
      const video = document.createElement('video');
      video.src = button.dataset.video;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.setAttribute('aria-label', 'NewDawn school video');
      dialogContent.replaceChildren(video);
      dialog.showModal();
    });
  });

  const galleryImages = [
    ['assets/images/06.webp', 'NewDawn learners and staff gathered beside a school bus'],
    ['assets/images/08.webp', 'Learners representing Kenya at an outdoor activity'],
    ['assets/images/HH.webp', 'Learners enjoying a live music performance'],
    ['assets/images/G.webp', 'A NewDawn learner proudly wearing medals'],
    ['assets/images/04.webp', 'Learners taking part in an outdoor team activity'],
    ['assets/images/02.webp', 'Learners presenting their creative work'],
    ['assets/images/J.webp', 'Learners playing table tennis'],
    ['assets/images/KK.webp', 'Learners playing chess']
  ];
  const openGallery = (startIndex) => {
    let activeIndex = startIndex;
    const viewer = document.createElement('div');
    viewer.className = 'gallery-viewer';
    const image = document.createElement('img');
    const controls = document.createElement('div');
    controls.className = 'gallery-controls';
    const previous = document.createElement('button');
    previous.type = 'button'; previous.textContent = '←'; previous.setAttribute('aria-label', 'Previous image');
    const next = document.createElement('button');
    next.type = 'button'; next.textContent = '→'; next.setAttribute('aria-label', 'Next image');
    controls.append(previous, next);
    viewer.append(image, controls);
    const render = () => {
      image.src = galleryImages[activeIndex][0];
      image.alt = galleryImages[activeIndex][1];
    };
    previous.addEventListener('click', () => { activeIndex = (activeIndex - 1 + galleryImages.length) % galleryImages.length; render(); });
    next.addEventListener('click', () => { activeIndex = (activeIndex + 1) % galleryImages.length; render(); });
    render();
    dialogContent.replaceChildren(viewer);
    dialog.showModal();
  };
  document.querySelectorAll('[data-gallery-open]').forEach((button) => {
    button.addEventListener('click', () => openGallery(Number(button.dataset.galleryOpen) || 0));
  });

  document.querySelector('[data-accordion]')?.addEventListener('toggle', (event) => {
    const current = event.target;
    if (!(current instanceof HTMLDetailsElement) || !current.open) return;
    document.querySelectorAll('[data-accordion] details').forEach((details) => {
      if (details !== current) details.open = false;
    });
  }, true);

  document.querySelector('[data-enquiry-form]')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const message = [
      'Hello NewDawn School,',
      '',
      `My name is ${data.get('name')}.`,
      `My phone number is ${data.get('phone')}.`,
      `I am interested in: ${data.get('level')}.`,
      data.get('message') ? `Message: ${data.get('message')}` : '',
      '',
      'Please contact me about the next steps.'
    ].filter(Boolean).join('\n');
    window.open(`https://wa.me/254769924670?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  });
})();
