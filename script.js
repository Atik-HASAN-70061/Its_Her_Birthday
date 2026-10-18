
"use strict";

/* =========================================
   JANNAT'S BIRTHDAY WEBSITE
   Dreamy Fairy Aesthetic
   ========================================= */

const FRIEND_NAME = "Jannat";
const BIRTHDAY_MONTH = 9; // October: January = 0
const BIRTHDAY_DAY = 20;
const PHOTO_COUNT = 20;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const touchDevice = window.matchMedia(
  "(hover: none), (pointer: coarse)"
).matches;

let particleTimer = null;
let toastTimer = null;
let countdownTimer = null;
let typingTimer = null;
let typingStarted = false;
let currentPhotoIndex = 0;
let celebrationTriggered = false;

/* ---------- Friend's name ---------- */

function setupFriendName() {
  $$("[data-friend-name]").forEach((element) => {
    element.textContent = FRIEND_NAME;
  });

  document.title = `For ${FRIEND_NAME} ♡ | A Little Birthday Surprise`;
}

/* ---------- Toast ---------- */

function showToast(message, duration = 2800) {
  const toast = $("#toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}

/* ---------- Floating magical particles ---------- */

function createParticle() {
  const container = $("#particles");
  if (!container || document.hidden) return;

  const symbols = ["♡", "✦", "✧", "🦋", "·", "✿"];
  const particle = document.createElement("span");

  particle.className = "particle";
  particle.textContent =
    symbols[Math.floor(Math.random() * symbols.length)];

  particle.style.left = `${Math.random() * 100}%`;
  particle.style.fontSize = `${10 + Math.random() * 13}px`;
  particle.style.setProperty(
    "--drift",
    `${Math.random() * 140 - 70}px`
  );

  const duration = 8 + Math.random() * 8;
  particle.style.animationDuration = `${duration}s`;

  container.appendChild(particle);

  setTimeout(() => particle.remove(), duration * 1000 + 200);
}

function startParticles() {
  if (reducedMotion || particleTimer) return;

  createParticle();
  particleTimer = setInterval(createParticle, 850);
}

function stopParticles() {
  if (!particleTimer) return;

  clearInterval(particleTimer);
  particleTimer = null;
}

/* ---------- Confetti celebration ---------- */

function launchConfetti(amount = 80) {
  const layer = $("#confettiLayer");
  if (!layer) return;

  const colors = [
    "#efafd0",
    "#d9c8ff",
    "#fff0a8",
    "#f8d9eb",
    "#c7b6ef",
    "#ffffff"
  ];

  const count = Math.min(Math.max(amount, 0), 180);

  for (let i = 0; i < count; i++) {
    const piece = document.createElement("span");

    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];

    piece.style.setProperty(
      "--confetti-drift",
      `${Math.random() * 220 - 110}px`
    );

    piece.style.setProperty(
      "--fall-time",
      `${2.5 + Math.random() * 2.5}s`
    );

    piece.style.width = `${5 + Math.random() * 6}px`;
    piece.style.height = `${8 + Math.random() * 9}px`;
    piece.style.animationDelay = `${Math.random() * 0.7}s`;

    layer.appendChild(piece);
    setTimeout(() => piece.remove(), 6000);
  }
}

/* ---------- Magical opening ---------- */

function openBirthdayWebsite() {
  const opening = $("#opening");
  const site = $("#birthdaySite");
  const button = $("#openSurprise");

  if (!opening || !site || site.classList.contains("is-visible")) return;

  if (button) {
    button.classList.add("opened");
    button.setAttribute("aria-expanded", "true");
    button.disabled = true;
  }

  setTimeout(() => {
    opening.classList.add("is-opening");
    site.classList.add("is-visible");
    site.setAttribute("aria-hidden", "false");

    startParticles();
    updateCountdown();
    startTypewriter();

    if (!reducedMotion) launchConfetti(55);

    showToast(`A little birthday magic for ${FRIEND_NAME} ♡`);

    setTimeout(() => {
      opening.hidden = true;
      document.body.classList.remove("no-scroll");
    }, reducedMotion ? 0 : 850);
  }, reducedMotion ? 0 : 500);
}

function setupOpening() {
  const button = $("#openSurprise");

  if ($("#opening")) {
    document.body.classList.add("no-scroll");
  }

  if (button) {
    button.addEventListener("click", openBirthdayWebsite);
  }

  $$("[data-open-surprise]").forEach((element) => {
    element.addEventListener("click", openBirthdayWebsite);
  });
}

/* ---------- Countdown ---------- */

function isBirthdayToday(now = new Date()) {
  return now.getMonth() === BIRTHDAY_MONTH &&
    now.getDate() === BIRTHDAY_DAY;
}

function getNextBirthday(now = new Date()) {
  let year = now.getFullYear();

  if (
    now.getMonth() > BIRTHDAY_MONTH ||
    (now.getMonth() === BIRTHDAY_MONTH &&
      now.getDate() > BIRTHDAY_DAY)
  ) {
    year++;
  }

  return new Date(year, BIRTHDAY_MONTH, BIRTHDAY_DAY, 0, 0, 0, 0);
}

function padNumber(value) {
  return String(value).padStart(2, "0");
}

function updateCountdown() {
  const now = new Date();

  const daysEl = $("#days");
  const hoursEl = $("#hours");
  const minutesEl = $("#minutes");
  const secondsEl = $("#seconds");

  const title = $("#countdownTitle");
  const subtitle = $("#countdownSubtitle");
  const footer = $("#countdownFooter");

  if (isBirthdayToday(now)) {
    if (daysEl) daysEl.textContent = "00";
    if (hoursEl) hoursEl.textContent = "00";
    if (minutesEl) minutesEl.textContent = "00";
    if (secondsEl) secondsEl.textContent = "00";

    if (title) {
      title.textContent = `Today is ${FRIEND_NAME}'s special day! ♡`;
    }

    if (subtitle) {
      subtitle.textContent =
        "The wait is over. Today is all about celebrating you!";
    }

    if (footer) footer.textContent = "October 20 · Your magical day is here ✨";

    activateBirthdayMode();
    return;
  }

  const target = getNextBirthday(now);
  let remaining = Math.max(0, target.getTime() - now.getTime());

  const days = Math.floor(remaining / 86400000);
  remaining %= 86400000;

  const hours = Math.floor(remaining / 3600000);
  remaining %= 3600000;

  const minutes = Math.floor(remaining / 60000);
  remaining %= 60000;

  const seconds = Math.floor(remaining / 1000);

  if (daysEl) daysEl.textContent = padNumber(days);
  if (hoursEl) hoursEl.textContent = padNumber(hours);
  if (minutesEl) minutesEl.textContent = padNumber(minutes);
  if (secondsEl) secondsEl.textContent = padNumber(seconds);

  if (title) title.innerHTML = 'Counting down to <em>your day</em>';
  if (subtitle) {
    subtitle.textContent = "Something lovely is just around the corner.";
  }

  if (footer) {
    footer.textContent =
      `Until October 20 · ${days} days of anticipation ♡`;
  }

  document.body.classList.remove("celebration-mode");
}

function startCountdown() {
  updateCountdown();

  clearInterval(countdownTimer);
  countdownTimer = setInterval(updateCountdown, 1000);
}

/* ---------- Birthday celebration mode ---------- */

function activateBirthdayMode() {
  document.body.classList.add("celebration-mode");

  if (celebrationTriggered) return;
  celebrationTriggered = true;

  setTimeout(() => {
    launchConfetti(130);
    showToast(
      `Happy Birthday, ${FRIEND_NAME}! Keep shining! ♡`,
      4500
    );
  }, 900);
}

/* ---------- Typewriter letter ---------- */

function startTypewriter() {
  const element = $("#typewriterText");
  if (!element || typingStarted) return;

  typingStarted = true;

  const fullText = element.dataset.text || "";
  element.textContent = "";

  if (reducedMotion) {
    element.textContent = fullText;
    return;
  }

  const caret = document.createElement("span");
  caret.className = "typing-caret";
  caret.setAttribute("aria-hidden", "true");
  element.appendChild(caret);

  let index = 0;

  function typeNext() {
    if (index >= fullText.length) {
      caret.remove();
      return;
    }

    const character = fullText[index];

    element.insertBefore(
      document.createTextNode(character),
      caret
    );

    index++;

    let delay = 27 + Math.random() * 18;

    if (".!?".includes(character)) delay += 210;
    else if (",;:".includes(character)) delay += 100;

    typingTimer = setTimeout(typeNext, delay);
  }

  typeNext();
}

/* ---------- Music controls ---------- */

function setupMusic() {
  const music = $("#birthdayMusic");
  const toggle = $("#musicToggle");
  const label = $("#musicLabel");

  if (!music || !toggle) return;

  music.volume = 0.45;

  function updateMusicState(playing) {
    toggle.classList.toggle("is-playing", playing);

    if (label) {
      label.textContent = playing ? "Pause music" : "Play music";
    }

    toggle.setAttribute(
      "aria-label",
      playing ? "Pause birthday music" : "Play birthday music"
    );
  }

  toggle.addEventListener("click", async () => {
    if (music.paused) {
      try {
        await music.play();
        updateMusicState(true);
        showToast("Let the birthday music play ♫");
      } catch (error) {
        updateMusicState(false);
        showToast(
          "Check that music/birthday-song.mp3 exists in your folder."
        );
      }
    } else {
      music.pause();
      updateMusicState(false);
    }
  });

  music.addEventListener("play", () => updateMusicState(true));
  music.addEventListener("pause", () => updateMusicState(false));
  music.addEventListener("error", () => updateMusicState(false));
}

/* ---------- Build 20 photo cards ---------- */

function getPhotoCaption(index) {
  const captions = [
    "A little ray of sunshine ♡",
    "Your own kind of magic ✧",
    "Pretty little moment",
    "A lovely memory ♡",
    "Keep shining, Jannat",
    "A little sparkle ✨",
    "Simply wonderful",
    "Soft days & sweet smiles",
    "A little fairy moment",
    "Beautiful in your own way",
    "Your smile, your magic ♡",
    "A little dreamer",
    "A lovely little frame",
    "Made of stardust ✧",
    "A moment to remember",
    "Keep blooming 🌸",
    "A little bit of wonder",
    "The birthday star ♡",
    "Dream, sparkle, repeat",
    "Always keep shining ✨"
  ];

  return captions[index] || `A little memory ${index + 1} ♡`;
}

function createPhotoCard(index) {
  const card = document.createElement("article");
  card.className = "polaroid reveal";
  card.dataset.photoIndex = String(index);
  card.dataset.caption = getPhotoCaption(index);

  const button = document.createElement("button");
  button.type = "button";
  button.className = "photo-button";
  button.setAttribute(
    "aria-label",
    `Open photo ${index + 1} of ${PHOTO_COUNT}`
  );

  const img = document.createElement("img");
  img.src = `photo${index + 1}.jpg`;
  img.alt = `Jannat photo ${index + 1}`;
  img.loading = index < 4 ? "eager" : "lazy";
  img.decoding = "async";

  img.addEventListener("error", () => {
    card.classList.add("image-missing");
    button.setAttribute(
      "aria-label",
      `Photo ${index + 1} is missing. Add images/photo${index + 1}.jpg`
    );
    img.hidden = true;
  });

  img.addEventListener("load", () => {
    card.classList.remove("image-missing");
    img.hidden = false;
  });

  button.appendChild(img);

  const caption = document.createElement("p");
  caption.className = "polaroid-caption";
  caption.textContent = getPhotoCaption(index);

  card.append(button, caption);
  return card;
}

function setupGallery() {
  const gallery = $("#photoGallery");
  if (!gallery) return;

  gallery.replaceChildren();

  for (let index = 0; index < PHOTO_COUNT; index++) {
    gallery.appendChild(createPhotoCard(index));
  }

  setupScrollReveal();
  setupGalleryControls();
  updateGalleryStatus();
}

/* ---------- Gallery and lightbox ---------- */

function getPhotoCards() {
  return $$(".polaroid");
}

function normalizePhotoIndex(index) {
  return (index + PHOTO_COUNT) % PHOTO_COUNT;
}

function getPhotoAt(index) {
  const normalizedIndex = normalizePhotoIndex(index);
  const card = $(`.polaroid[data-photo-index="${normalizedIndex}"]`);
  const image = card ? $("img", card) : null;

  if (!card || !image) return null;

  return {
    index: normalizedIndex,
    card,
    image,
    caption: card.dataset.caption || `Jannat photo ${normalizedIndex + 1}`
  };
}

function updateGalleryStatus() {
  const status = $("#galleryStatus");
  if (!status) return;

  status.textContent =
    `${padNumber(currentPhotoIndex + 1)} / ${padNumber(PHOTO_COUNT)}`;
}

function focusGalleryPhoto(index, scrollToPhoto = false) {
  currentPhotoIndex = normalizePhotoIndex(index);

  getPhotoCards().forEach((card) => {
    card.classList.toggle(
      "photo-selected",
      Number(card.dataset.photoIndex) === currentPhotoIndex
    );
  });

  updateGalleryStatus();

  if (scrollToPhoto) {
    const photo = getPhotoAt(currentPhotoIndex);

    photo?.card.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "center"
    });
  }
}

function openLightbox(index) {
  const lightbox = $("#lightbox");
  const image = $("#lightboxImage");
  const caption = $("#lightboxCaption");
  const photo = getPhotoAt(index);

  if (!lightbox || !image || !photo) return;

  if (photo.image.hidden || photo.card.classList.contains("image-missing")) {
    showToast(`Add images/photo${photo.index + 1}.jpg to see this photo.`);
    return;
  }

  currentPhotoIndex = photo.index;
  image.src = photo.image.currentSrc || photo.image.src;
  image.alt = photo.image.alt;

  if (caption) caption.textContent = photo.caption;

  lightbox.hidden = false;
  document.body.classList.add("no-scroll");
  updateGalleryStatus();

  $("#closeLightbox")?.focus();
}

function closeLightbox() {
  const lightbox = $("#lightbox");
  if (!lightbox || lightbox.hidden) return;

  lightbox.hidden = true;
  document.body.classList.remove("no-scroll");

  const photo = getPhotoAt(currentPhotoIndex);
  $(".photo-button", photo?.card || document)?.focus();
}

function stepLightbox(direction) {
  const nextIndex = normalizePhotoIndex(currentPhotoIndex + direction);
  const photo = getPhotoAt(nextIndex);
  const image = $("#lightboxImage");
  const caption = $("#lightboxCaption");

  if (!photo || !image) return;

  // Skip missing images when browsing the lightbox.
  let attempts = 0;
  let candidate = photo;

  while (
    candidate &&
    (candidate.image.hidden || candidate.card.classList.contains("image-missing")) &&
    attempts < PHOTO_COUNT
  ) {
    currentPhotoIndex = normalizePhotoIndex(currentPhotoIndex + direction);
    candidate = getPhotoAt(currentPhotoIndex);
    attempts++;
  }

  if (!candidate || attempts >= PHOTO_COUNT) {
    showToast("Add your photos to the images folder first.");
    return;
  }

  currentPhotoIndex = candidate.index;

  image.style.opacity = "0";

  setTimeout(() => {
    image.src = candidate.image.currentSrc || candidate.image.src;
    image.alt = candidate.image.alt;

    if (caption) caption.textContent = candidate.caption;

    image.onload = () => {
      image.style.opacity = "1";
    };

    if (image.complete) image.style.opacity = "1";

    updateGalleryStatus();
  }, reducedMotion ? 0 : 120);
}

function setupGalleryControls() {
  const gallery = $("#photoGallery");

  gallery?.addEventListener("click", (event) => {
    const button = event.target.closest(".photo-button");
    if (!button) return;

    const card = button.closest(".polaroid");
    if (!card) return;

    const index = Number(card.dataset.photoIndex);
    focusGalleryPhoto(index);
    openLightbox(index);
  });

  $("#prevPhoto")?.addEventListener("click", () => {
    focusGalleryPhoto(currentPhotoIndex - 1, true);
  });

  $("#nextPhoto")?.addEventListener("click", () => {
    focusGalleryPhoto(currentPhotoIndex + 1, true);
  });

  $("#closeLightbox")?.addEventListener("click", closeLightbox);
  $("#lightboxPrev")?.addEventListener("click", () => stepLightbox(-1));
  $("#lightboxNext")?.addEventListener("click", () => stepLightbox(1));

  $("#lightbox")?.addEventListener("click", (event) => {
    if (event.target.id === "lightbox") closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    const lightbox = $("#lightbox");
    if (!lightbox || lightbox.hidden) return;

    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowRight") stepLightbox(1);
    if (event.key === "ArrowLeft") stepLightbox(-1);
  });
}

/* ---------- 3D gift box ---------- */

function setupGiftBox() {
  const button = $("#giftButton");
  const message = $("#giftMessage");

  if (!button || !message) return;

  button.addEventListener("click", () => {
    const opening = !button.classList.contains("is-open");

    button.classList.toggle("is-open", opening);
    button.setAttribute("aria-expanded", String(opening));
    message.hidden = !opening;

    const caption = $(".gift-caption", button);

    if (caption) {
      caption.textContent = opening
        ? "your little wish is waiting ♡"
        : "tap to open your little gift ♡";
    }

    if (opening) {
      launchConfetti(75);
      showToast(`A little surprise for ${FRIEND_NAME}! ♡`);

      setTimeout(() => {
        message.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "nearest"
        });
      }, 100);
    }
  });
}

/* ---------- Secret message ---------- */

function setupSecretMessage() {
  const button = $("#moreSurprise");
  const message = $("#hiddenMessage");

  if (!button || !message) return;

  button.addEventListener("click", () => {
    const opening = message.hidden;

    message.hidden = !opening;
    button.setAttribute("aria-expanded", String(opening));

    if (opening) {
      launchConfetti(25);
      showToast("A tiny secret, just for you ♡");
    }
  });
}

/* ---------- Scroll reveal ---------- */

function setupScrollReveal() {
  const items = $$(".reveal:not([data-reveal-ready])");

  if (!items.length) return;

  if (!("IntersectionObserver" in window) || reducedMotion) {
    items.forEach((item) => {
      item.classList.add("is-revealed");
      item.dataset.revealReady = "true";
    });
    return;
  }

  if (!window.revealObserver) {
    window.revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-revealed");
        entry.target.dataset.revealReady = "true";
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -25px 0px"
    });
  }

  items.forEach((item) => window.revealObserver.observe(item));
}

/* ---------- Cursor sparkle and hero parallax ---------- */

function setupCursorEffects() {
  const glow = $("#cursorGlow");

  if (touchDevice || reducedMotion) {
    if (glow) glow.hidden = true;
    return;
  }

  let lastSparkleTime = 0;

  document.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;

    if (glow) {
      glow.style.opacity = "1";
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    }

    const now = performance.now();
    if (now - lastSparkleTime < 85) return;

    lastSparkleTime = now;

    const sparkle = document.createElement("span");
    sparkle.className = "cursor-sparkle";
    sparkle.textContent = Math.random() > 0.5 ? "✦" : "✧";

    sparkle.style.left = `${event.clientX}px`;
    sparkle.style.top = `${event.clientY}px`;

    sparkle.style.setProperty(
      "--sx",
      `${Math.random() * 34 - 17}px`
    );

    sparkle.style.setProperty(
      "--sy",
      `${Math.random() * 34 - 17}px`
    );

    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 750);
  }, { passive: true });

  const hero = $(".hero");

  if (!hero) return;

  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    const frame = $(".portrait-frame", hero);
    if (frame) {
      frame.style.transform =
        `rotate(${2 + x * 3}deg) translate(${x * 5}px, ${y * 5}px)`;
    }

    $$(".floating-decor", hero).forEach((decor, index) => {
      const factor = (index + 1) * 6;
      decor.style.translate = `${x * factor}px ${y * factor}px`;
    });
  });

  hero.addEventListener("pointerleave", () => {
    const frame = $(".portrait-frame", hero);
    if (frame) frame.style.transform = "";

    $$(".floating-decor", hero).forEach((decor) => {
      decor.style.translate = "";
    });
  });
}

/* ---------- Back to top ---------- */

function setupBackToTop() {
  const button = $("#backToTop");
  if (!button) return;

  function updateButton() {
    button.classList.toggle("visible", window.scrollY > 450);
  }

  window.addEventListener("scroll", updateButton, { passive: true });
  updateButton();

  button.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? "auto" : "smooth"
    });
  });
}

/* ---------- Image fallback for static images ---------- */

function setupStaticImageFallbacks() {
  $$("img:not(.polaroid img)").forEach((img) => {
    img.addEventListener("error", () => {
      img.classList.add("image-not-loaded");
      img.alt = img.alt || "Image not available";

      if (img.id === "featured-photo") {
        const frame = img.closest(".portrait-inner");
        if (frame) frame.classList.add("image-missing");
        img.hidden = true;
      }
    });

    img.addEventListener("load", () => {
      img.hidden = false;
      img.classList.remove("image-not-loaded");
      img.closest(".portrait-inner")?.classList.remove("image-missing");
    });
  });
}

/* ---------- Visibility changes ---------- */

function setupVisibilityHandling() {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopParticles();
      return;
    }

    if ($("#birthdaySite")?.classList.contains("is-visible")) {
      startParticles();
    }

    updateCountdown();
  });
}

/* ---------- Initialize everything ---------- */

function initBirthdayWebsite() {
  setupFriendName();
  setupOpening();
  setupMusic();
  setupGiftBox();
  setupSecretMessage();
  setupGallery();
  setupScrollReveal();
  setupCursorEffects();
  setupBackToTop();
  setupStaticImageFallbacks();
  startCountdown();
  setupVisibilityHandling();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initBirthdayWebsite);
} else {
  initBirthdayWebsite();
}
