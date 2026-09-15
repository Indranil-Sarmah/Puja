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
    caption: `Idol making progress — Step ${num}`,
    day: `Step ${num}`,
  };
});

function createGalleryCard(item, index) {
  const card = document.createElement('div');
  card.className = 'gallery-card';
  card.dataset.index = String(index);
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', `View ${item.day}: ${item.caption}`);
  card.innerHTML = `
    <div class="gallery-card-media">
      <img src="${item.src}" alt="${item.caption}" loading="lazy">
      <span class="gallery-card-day">${item.day}</span>
      <p class="gallery-card-caption">${item.caption}</p>
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

function initImageSlider() {
  const slider = document.getElementById('imageSlider');
  const sliderImg = document.getElementById('sliderImg');
  const sliderCaption = document.getElementById('sliderCaption');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  const galleryScroll = document.getElementById('galleryScroll');

  if (!slider || !sliderImg || !sliderCaption || !prevBtn || !nextBtn || !galleryScroll) return;

  let currentIndex = 0;

  const showSlide = (index) => {
    const total = galleryImages.length;
    currentIndex = ((index % total) + total) % total;
    const item = galleryImages[currentIndex];
    sliderImg.src = item.src;
    sliderImg.alt = item.caption;
    sliderCaption.textContent = `${item.day} — ${item.caption}`;
  };

  const openSlider = (index) => {
    showSlide(index);
    slider.classList.add('is-open');
    slider.setAttribute('aria-hidden', 'false');
    document.body.classList.add('slider-open');
    galleryScroll.style.animationPlayState = 'paused';
    prevBtn.focus();
  };

  const closeSlider = () => {
    slider.classList.remove('is-open');
    slider.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('slider-open');
    galleryScroll.style.animationPlayState = '';
  };

  galleryScroll.addEventListener('click', (event) => {
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

document.addEventListener('DOMContentLoaded', () => {
  initHeroVideo();
  initFallingDecor();
  renderGallery();
  initImageSlider();
  initPushpanjali();
});
