/**
 * Viswakarma Puja 2026
 */

const flowers = ['🌸', '🌺', '🪷', '💐', '🌼', '🏵️'];
const confettiColors = ['#FFD700', '#FF9933', '#C41E3A', '#138808', '#8B0000', '#FF69B4', '#FF1493', '#00CED1'];

function initFallingDecor() {
  const container = document.getElementById('fallingDecor');
  const welcome = document.querySelector('.welcome');
  if (!container || !welcome) return;

  const fallEnd = `${Math.round(welcome.offsetHeight * 0.62)}px`;
  const total = 28;

  for (let i = 0; i < total; i += 1) {
    const isFlower = Math.random() > 0.5;
    const el = document.createElement('span');

    // Keep particles on left/right edges — away from hero center
    const onLeft = Math.random() > 0.5;
    const left = onLeft
      ? `${2 + Math.random() * 18}%`
      : `${80 + Math.random() * 18}%`;

    if (isFlower) {
      el.className = 'fall-item fall-item--flower';
      el.textContent = flowers[Math.floor(Math.random() * flowers.length)];
      el.style.fontSize = `${8 + Math.random() * 6}px`;
    } else {
      el.className = 'fall-item fall-item--confetti';
      el.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      el.style.width = `${3 + Math.random() * 3}px`;
      el.style.height = `${5 + Math.random() * 4}px`;
    }

    el.style.left = left;
    el.style.setProperty('--fall-end', fallEnd);
    el.style.animationDuration = `${5 + Math.random() * 5}s`;
    el.style.animationDelay = `${Math.random() * 8}s`;
    el.style.setProperty('--sway', `${-15 + Math.random() * 30}px`);
    el.style.setProperty('--spin', `${180 + Math.random() * 360}deg`);

    container.appendChild(el);
  }

  window.addEventListener('resize', () => {
    const updated = `${Math.round(welcome.offsetHeight * 0.62)}px`;
    container.querySelectorAll('.fall-item').forEach((item) => {
      item.style.setProperty('--fall-end', updated);
    });
  });
}

const galleryImages = Array.from({ length: 10 }, (_, i) => {
  const num = String(i + 1).padStart(2, '0');
  return {
    src: `assets/images/Slider/${num}.jpg`,
    day: `Step ${num}`,
  };
});

function createGalleryCard(item, index) {
  const card = document.createElement('div');
  card.className = 'gallery-card';
  card.dataset.index = String(index);
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', `View ${item.day}`);
  card.innerHTML = `
    <div class="gallery-card-media">
      <img src="${item.src}" alt="${item.day}" loading="lazy">
      <span class="gallery-card-day">${item.day}</span>
    </div>
  `;
  return card;
}

function fillGalleryRow(container, images) {
  const duplicated = [...images, ...images];
  duplicated.forEach((item, i) => {
    container.appendChild(createGalleryCard(item, i % images.length));
  });
}

function renderGallery() {
  const row = document.getElementById('galleryScroll');
  if (!row || galleryImages.length === 0) return;
  fillGalleryRow(row, galleryImages);
}

function initGalleryCarousel() {
  const panel = document.querySelector('.gallery-panel');
  const track = document.getElementById('galleryScroll');
  if (!panel || !track) return null;

  const AUTO_DURATION = 35;
  const CLICK_THRESHOLD = 8;
  const FRICTION = 0.92;
  const MIN_VELOCITY = 12;

  let offset = 0;
  let loopWidth = 0;
  let autoSpeed = 50;
  let velocity = 0;
  let isDragging = false;
  let isPaused = false;
  let isHovered = false;
  let dragStartX = 0;
  let lastPointerX = 0;
  let lastMoveTime = 0;
  let dragMoved = false;
  let suppressClick = false;
  let rafId = null;
  let lastFrameTime = null;

  const measure = () => {
    loopWidth = track.scrollWidth / 2;
    autoSpeed = loopWidth > 0 ? loopWidth / AUTO_DURATION : 50;
  };

  const wrapOffset = () => {
    if (loopWidth <= 0) return;
    while (offset <= -loopWidth) offset += loopWidth;
    while (offset > 0) offset -= loopWidth;
  };

  const applyTransform = () => {
    track.style.transform = `translate3d(${offset}px, 0, 0)`;
  };

  const tick = (time) => {
    if (lastFrameTime == null) lastFrameTime = time;
    const dt = Math.min((time - lastFrameTime) / 1000, 0.05);
    lastFrameTime = time;

    if (!isDragging && !isPaused && !isHovered) {
      if (Math.abs(velocity) > MIN_VELOCITY) {
        offset += velocity * dt;
        velocity *= FRICTION ** (dt * 60);
        if (Math.abs(velocity) <= MIN_VELOCITY) velocity = 0;
      } else {
        offset -= autoSpeed * dt;
      }
      wrapOffset();
      applyTransform();
    }

    rafId = requestAnimationFrame(tick);
  };

  const onPointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    suppressClick = false;
    isDragging = true;
    dragMoved = false;
    velocity = 0;
    dragStartX = event.clientX;
    lastPointerX = event.clientX;
    lastMoveTime = performance.now();
    panel.classList.add('is-dragging');
    track.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (!isDragging) return;

    const now = performance.now();
    const dx = event.clientX - lastPointerX;
    const dt = Math.max(now - lastMoveTime, 1);

    if (Math.abs(event.clientX - dragStartX) > CLICK_THRESHOLD) {
      dragMoved = true;
    }

    offset += dx;
    velocity = (dx / dt) * 1000;
    wrapOffset();
    applyTransform();

    lastPointerX = event.clientX;
    lastMoveTime = now;
  };

  const endDrag = (event) => {
    if (!isDragging) return;

    isDragging = false;
    panel.classList.remove('is-dragging');

    if (track.hasPointerCapture(event.pointerId)) {
      track.releasePointerCapture(event.pointerId);
    }

    if (dragMoved) {
      suppressClick = true;
      velocity *= 0.85;
    }
  };

  panel.addEventListener('pointerdown', onPointerDown);
  panel.addEventListener('pointermove', onPointerMove);
  panel.addEventListener('pointerup', endDrag);
  panel.addEventListener('pointercancel', endDrag);
  panel.addEventListener('mouseenter', () => { isHovered = true; });
  panel.addEventListener('mouseleave', () => { isHovered = false; });

  panel.addEventListener('wheel', (event) => {
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;

    event.preventDefault();
    offset -= event.deltaX;
    velocity = -event.deltaX * 8;
    wrapOffset();
    applyTransform();
  }, { passive: false });

  const remeasure = () => {
    measure();
    wrapOffset();
    applyTransform();
  };

  window.addEventListener('resize', remeasure);
  track.querySelectorAll('img').forEach((img) => {
    if (img.complete) return;
    img.addEventListener('load', remeasure, { once: true });
  });

  remeasure();
  rafId = requestAnimationFrame(tick);

  return {
    wasDragged: () => suppressClick,
    clearDrag: () => { suppressClick = false; },
    pause: () => { isPaused = true; velocity = 0; },
    resume: () => { isPaused = false; },
    destroy: () => {
      if (rafId) cancelAnimationFrame(rafId);
    },
  };
}

function initImageSlider(galleryCarousel) {
  const slider = document.getElementById('imageSlider');
  const sliderImg = document.getElementById('sliderImg');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  const closeBtn = document.getElementById('sliderClose');
  const galleryScroll = document.getElementById('galleryScroll');

  if (!slider || !sliderImg || !prevBtn || !nextBtn || !closeBtn || !galleryScroll) return;

  let currentIndex = 0;

  const showSlide = (index) => {
    const total = galleryImages.length;
    currentIndex = ((index % total) + total) % total;
    const item = galleryImages[currentIndex];
    sliderImg.src = item.src;
    sliderImg.alt = item.day;
  };

  const openSlider = (index) => {
    showSlide(index);
    slider.classList.add('is-open');
    slider.setAttribute('aria-hidden', 'false');
    document.body.classList.add('slider-open');
    galleryCarousel?.pause();
    prevBtn.focus();
  };

  const closeSlider = () => {
    slider.classList.remove('is-open');
    slider.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('slider-open');
    galleryCarousel?.resume();
  };

  galleryScroll.addEventListener('click', (event) => {
    if (galleryCarousel?.wasDragged()) {
      galleryCarousel.clearDrag();
      return;
    }
    const card = event.target.closest('.gallery-card');
    if (!card) return;
    openSlider(Number(card.dataset.index));
  });

  galleryScroll.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const card = event.target.closest('.gallery-card');
    if (!card) return;
    event.preventDefault();
    openSlider(Number(card.dataset.index));
  });

  prevBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    showSlide(currentIndex - 1);
  });

  nextBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    showSlide(currentIndex + 1);
  });

  closeBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    closeSlider();
  });

  slider.addEventListener('click', (event) => {
    if (
      event.target === slider
      || event.target.classList.contains('image-slider__backdrop')
    ) {
      closeSlider();
    }
  });

  slider.querySelector('.image-slider__dialog')?.addEventListener('click', (event) => {
    event.stopPropagation();
  });

  document.addEventListener('keydown', (event) => {
    if (!slider.classList.contains('is-open')) return;

    if (event.key === 'Escape') {
      closeSlider();
    } else if (event.key === 'ArrowLeft') {
      showSlide(currentIndex - 1);
    } else if (event.key === 'ArrowRight') {
      showSlide(currentIndex + 1);
    }
  });
}

function initHeroVideo() {
  const video = document.getElementById('heroDesignVideo');
  const wrap = document.getElementById('heroWrap');
  if (!video || !wrap) return;

  const activateVideo = () => {
    wrap.classList.add('has-video');
    video.play().catch(() => {
      wrap.classList.remove('has-video');
    });
  };

  video.addEventListener('loadeddata', activateVideo);
  video.addEventListener('canplay', activateVideo);
  video.addEventListener('error', () => wrap.classList.remove('has-video'));

  if (video.readyState >= 2) activateVideo();
}

function initPushpanjali() {
  const btn = document.getElementById('pushpanjaliBtn');
  const flowerContainer = document.getElementById('thrownFlowers');
  const incense = document.getElementById('ritualIncense');
  const diya = document.getElementById('ritualDiya');
  const heroWrap = document.querySelector('.welcome-hero-wrap');

  if (!btn || !flowerContainer) return;

  const throwEmojis = ['🌸', '🌺', '🪷', '💐', '🌼', '🏵️', '🌷'];

  btn.addEventListener('click', () => {
    incense?.classList.add('active');
    diya?.classList.add('active');

    const btnRect = btn.getBoundingClientRect();
    const heroRect = heroWrap?.getBoundingClientRect();

    const startX = btnRect.left + btnRect.width / 2;
    const startY = btnRect.top + btnRect.height / 2;

    const targetX = heroRect
      ? heroRect.left + heroRect.width / 2
      : window.innerWidth / 2;
    const targetY = heroRect
      ? heroRect.top + heroRect.height * 0.35
      : window.innerHeight * 0.25;

    for (let i = 0; i < 24; i += 1) {
      const el = document.createElement('span');
      el.className = 'thrown-flower';
      el.textContent = throwEmojis[Math.floor(Math.random() * throwEmojis.length)];
      el.style.left = `${startX}px`;
      el.style.top = `${startY}px`;
      el.style.fontSize = `${14 + Math.random() * 14}px`;

      const spread = 40 + Math.random() * 50;
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.4;
      const tx = (targetX - startX) + Math.cos(angle) * spread;
      const ty = (targetY - startY) + Math.sin(angle) * spread - 20;

      el.style.setProperty('--tx', `${tx}px`);
      el.style.setProperty('--ty', `${ty}px`);
      el.style.setProperty('--rot', `${-180 + Math.random() * 360}deg`);
      el.style.setProperty('--drift', `${-20 + Math.random() * 40}px`);
      el.style.animationDelay = `${Math.random() * 0.3}s`;

      flowerContainer.appendChild(el);
      setTimeout(() => el.remove(), 2500);
    }

    btn.classList.add('pushpanjali-btn--offered');
    setTimeout(() => btn.classList.remove('pushpanjali-btn--offered'), 600);
  });
}

function initMantraAudio() {
  const audio = document.getElementById('mantraAudio');
  const btn = document.getElementById('mantraToggleBtn');
  if (!audio || !btn) return;

  const icon = btn.querySelector('.mantra-toggle-btn__icon');
  let userPaused = false;
  let soundEnabled = false;

  audio.loop = true;
  audio.volume = 0.45;

  const syncPlayingUI = () => {
    const playing = !audio.paused;
    btn.classList.toggle('is-playing', playing);
    btn.setAttribute('aria-pressed', String(playing));
    btn.setAttribute('aria-label', playing ? 'Pause mantra' : 'Play mantra');
    icon.textContent = playing ? '⏸' : '▶';
  };

  const playMuted = async () => {
    if (userPaused) return;
    audio.muted = true;
    try {
      await audio.play();
    } catch {
      /* Retry when media is ready */
    }
    syncPlayingUI();
  };

  const enableSound = async () => {
    if (soundEnabled) return;
    soundEnabled = true;
    audio.muted = false;

    if (!userPaused) {
      try {
        await audio.play();
      } catch {
        await playMuted();
      }
    }

    syncPlayingUI();
  };

  const tryAutoplay = async () => {
    if (userPaused) return;

    audio.muted = false;
    try {
      await audio.play();
      soundEnabled = true;
    } catch {
      await playMuted();
    }

    syncPlayingUI();
  };

  const playMantra = async () => {
    userPaused = false;
    audio.muted = false;
    soundEnabled = true;
    try {
      await audio.play();
    } catch {
      syncPlayingUI();
    }
  };

  const pauseMantra = () => {
    userPaused = true;
    audio.pause();
    syncPlayingUI();
  };

  btn.addEventListener('click', () => {
    if (audio.paused) playMantra();
    else pauseMantra();
  });

  audio.addEventListener('play', syncPlayingUI);
  audio.addEventListener('pause', syncPlayingUI);

  const unlockEvents = ['pointerdown', 'touchstart', 'keydown', 'scroll', 'wheel'];
  const unlockSound = () => {
    enableSound();
    unlockEvents.forEach((eventName) => {
      document.removeEventListener(eventName, unlockSound, true);
    });
  };

  unlockEvents.forEach((eventName) => {
    document.addEventListener(eventName, unlockSound, { capture: true, passive: true });
  });

  tryAutoplay();
  audio.addEventListener('canplaythrough', tryAutoplay, { once: true });
  window.addEventListener('load', tryAutoplay);
  window.addEventListener('pageshow', tryAutoplay);
}

const VISIT_COUNTER = {
  key: 'bcpl-viswakarma-puja-2026-total-visits',
  sessionFlag: 'vp2026_visit_recorded',
  apiBase: 'https://countapi.mileshilliard.com/api/v1',
};

async function initVisitCount() {
  const counter = document.getElementById('visitCount');
  if (!counter) return;

  const isNewSession = !sessionStorage.getItem(VISIT_COUNTER.sessionFlag);
  const endpoint = isNewSession ? 'hit' : 'get';
  const url = `${VISIT_COUNTER.apiBase}/${endpoint}/${VISIT_COUNTER.key}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Counter unavailable');

    const data = await response.json();
    const value = Number(data.value);
    if (Number.isNaN(value)) throw new Error('Invalid counter value');

    if (isNewSession) {
      sessionStorage.setItem(VISIT_COUNTER.sessionFlag, '1');
    }

    counter.textContent = value.toLocaleString('en-IN');
  } catch {
    counter.textContent = '—';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initMantraAudio();
  initHeroVideo();
  initFallingDecor();
  renderGallery();
  const galleryCarousel = initGalleryCarousel();
  initImageSlider(galleryCarousel);
  initPushpanjali();
  initVisitCount();
});
