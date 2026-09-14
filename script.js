(() => {
  const config = window.NEWDawn_CONFIG || {};
  const school = config.school || {};

  const applySiteConfig = () => {
    if (school.webmailUrl) document.querySelectorAll('[data-webmail-link]').forEach(link => { link.href = school.webmailUrl; });
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
        const query = link.getAttribute('href')?.split('?')[1];
        link.href = `mailto:${school.email}${query ? '?' + query : ''}`;
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

  const heroImage = document.querySelector('.hero-media img');
  const heroNext = document.querySelector('[data-hero-next]');
  const heroPhotos = [ ['05', 'Learning together'], ['06', 'Our school community'], ['03', 'Finding a rhythm'], ['02', 'Ideas come to life'] ];
  let photoIndex = 0;
  heroNext?.addEventListener('click', () => {
    if (!heroImage) return;
    const nextIndex = (photoIndex + 1) % heroPhotos.length;
    const [file, caption] = heroPhotos[nextIndex];
    heroNext.disabled = true;
    const nextImage = new Image();
    nextImage.onload = () => {
      photoIndex = nextIndex;
      heroImage.removeAttribute('srcset');
      heroImage.src = nextImage.src;
      document.querySelector('[data-hero-caption]').textContent = caption;
      document.querySelector('[data-photo-status]').textContent = 'Photo ' + (photoIndex + 1) + ' of ' + heroPhotos.length + ': ' + caption;
      heroNext.disabled = false;
    };
    nextImage.onerror = () => { heroNext.disabled = false; document.querySelector('[data-photo-status]').textContent = 'Photo could not load. Please try again.'; };
    nextImage.src = 'assets/images/' + file + '.webp';
  });

  const header = document.querySelector('[data-header]');
  const menu = document.querySelector('[data-menu]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const setHeader = () => header?.classList.toggle('scrolled', window.scrollY > 45);
  setHeader();
  window.addEventListener('scroll', setHeader, { passive: true });

  const mobileNav = window.matchMedia('(max-width: 1000px)');
  const setMenu = (open) => {
    if (menu) menu.inert = mobileNav.matches && !open;
    menu?.classList.toggle('open', open);
    menuToggle?.classList.toggle('active', open);
    menuToggle?.setAttribute('aria-expanded', String(open));
    menuToggle?.querySelector('.sr-only')?.replaceChildren(document.createTextNode(open ? 'Close menu' : 'Open menu'));
  };
  setMenu(false);
  mobileNav.addEventListener('change', () => setMenu(false));
  menuToggle?.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu?.classList.contains('open')) { setMenu(false); menuToggle?.focus(); }
  });

  const reveals = document.querySelectorAll('.reveal');
  // Content stays visible if enhancement fails or JavaScript is disabled.
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
    reveals.forEach((item) => { item.classList.add('will-reveal'); revealObserver.observe(item); });
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

  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js?v=20260914-1').catch(() => {}));
  }

  // Progressive app actions: native sharing and installation where supported.
  const utilityDock = document.createElement('div');
  utilityDock.className = 'utility-dock';
  utilityDock.setAttribute('aria-label', 'Page tools');
  const shareButton = document.createElement('button');
  shareButton.type = 'button';
  shareButton.className = 'utility-action';
  shareButton.innerHTML = '<span aria-hidden="true">↗</span><b>Share</b>';
  shareButton.setAttribute('aria-label', 'Share this page');
  shareButton.addEventListener('click', async () => {
    const shareData = { title: document.title, text: 'Explore NewDawn School', url: location.href };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(location.href);
        shareButton.querySelector('b').textContent = 'Copied';
        setTimeout(() => { shareButton.querySelector('b').textContent = 'Share'; }, 1800);
      }
    } catch (error) {
      if (error.name !== 'AbortError') location.href = `mailto:?subject=${encodeURIComponent(document.title)}&body=${encodeURIComponent(location.href)}`;
    }
  });
  utilityDock.append(shareButton);

  let installPrompt;
  const installButton = document.createElement('button');
  installButton.type = 'button';
  installButton.className = 'utility-action utility-install';
  installButton.hidden = true;
  installButton.innerHTML = '<span aria-hidden="true">↓</span><b>Install</b>';
  installButton.setAttribute('aria-label', 'Install NewDawn School app');
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    installPrompt = event;
    installButton.hidden = false;
  });
  installButton.addEventListener('click', async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
    installButton.hidden = true;
  });
  window.addEventListener('appinstalled', () => { installButton.hidden = true; });
  utilityDock.append(installButton);
  const footer = document.querySelector('.footer-bottom');
  footer?.append(utilityDock);

  // Prefetch likely same-origin destinations without spending data on constrained connections.
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const canPrefetch = !connection?.saveData && !['slow-2g', '2g'].includes(connection?.effectiveType);
  const internalPages = [...document.querySelectorAll('a[href]')]
    .map((link) => new URL(link.href, location.href))
    .filter((url) => url.origin === location.origin && /\.html$|\/$/.test(url.pathname))
    .map((url) => url.href)
    .filter((url, index, urls) => url !== location.href && urls.indexOf(url) === index);
  if (canPrefetch && internalPages.length) {
    if (HTMLScriptElement.supports?.('speculationrules')) {
      const rules = document.createElement('script');
      rules.type = 'speculationrules';
      rules.textContent = JSON.stringify({ prefetch: [{ source: 'list', urls: internalPages, eagerness: 'moderate' }] });
      document.body.append(rules);
    } else {
      const prefetched = new Set();
      document.addEventListener('pointerover', (event) => {
        const link = event.target.closest('a[href]');
        if (!link) return;
        const url = new URL(link.href, location.href);
        if (url.origin !== location.origin || prefetched.has(url.href)) return;
        prefetched.add(url.href);
        const hint = document.createElement('link');
        hint.rel = 'prefetch'; hint.href = url.href;
        document.head.append(hint);
      }, { passive: true });
    }
  }

  const dialog = document.querySelector('[data-dialog]');
  const dialogContent = document.querySelector('[data-dialog-content]');
  const closeDialog = () => {
    dialog?.close();
    dialogContent?.replaceChildren();
  };
  document.querySelector('[data-dialog-close]')?.addEventListener('click', closeDialog);
  dialog?.addEventListener('close', () => { dialogContent?.querySelector('video')?.pause(); dialogContent?.replaceChildren(); });
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
    window.location.assign(`https://wa.me/${school.whatsappNumber || '254769924670'}?text=${encodeURIComponent(message)}`);
  });
})();
