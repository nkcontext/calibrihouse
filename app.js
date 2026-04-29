// 12309 Calibri Ln listing — gallery lightbox, contact modal, Leaflet map.

const TOTAL_PHOTOS = 32;

// ---------- Lightbox ----------
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lb-img");
const lbCaption = document.getElementById("lb-caption");
let currentIdx = 0;

function openLightbox(idx) {
  currentIdx = Math.max(0, Math.min(idx, TOTAL_PHOTOS - 1));
  showPhoto(currentIdx);
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = "";
}

function showPhoto(idx) {
  const n = String(idx + 1).padStart(2, "0");
  lbImg.src = `./images/full/${n}.jpg`;
  lbImg.alt = `Photo ${idx + 1} of ${TOTAL_PHOTOS}`;
  lbCaption.textContent = `${idx + 1} / ${TOTAL_PHOTOS}`;

  // Preload neighbours for snappier nav.
  [idx - 1, idx + 1].forEach((i) => {
    if (i >= 0 && i < TOTAL_PHOTOS) {
      const pre = new Image();
      pre.src = `./images/full/${String(i + 1).padStart(2, "0")}.jpg`;
    }
  });
}

function navPhoto(delta) {
  currentIdx = (currentIdx + delta + TOTAL_PHOTOS) % TOTAL_PHOTOS;
  showPhoto(currentIdx);
}

document.querySelectorAll(".g-cell").forEach((cell) => {
  cell.addEventListener("click", () => {
    const idx = parseInt(cell.getAttribute("data-idx"), 10) || 0;
    openLightbox(idx);
  });
});
document.getElementById("lb-close").addEventListener("click", closeLightbox);
document.getElementById("lb-prev").addEventListener("click", () => navPhoto(-1));
document.getElementById("lb-next").addEventListener("click", () => navPhoto(1));

document.addEventListener("keydown", (e) => {
  if (lightbox.hidden) return;
  if (e.key === "Escape") closeLightbox();
  else if (e.key === "ArrowLeft") navPhoto(-1);
  else if (e.key === "ArrowRight") navPhoto(1);
});

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

// ---------- Contact modal ----------
const contactModal = document.getElementById("contact-modal");
const openContactBtn = document.getElementById("open-contact");
const closeContactBtn = document.getElementById("contact-close");

openContactBtn?.addEventListener("click", () => {
  contactModal.hidden = false;
});
closeContactBtn?.addEventListener("click", () => {
  contactModal.hidden = true;
});
contactModal?.addEventListener("click", (e) => {
  if (e.target === contactModal) contactModal.hidden = true;
});

// ---------- Scenario tabs ("What fits inside") ----------
const tabs = document.querySelectorAll(".scenario-tab");
const panels = document.querySelectorAll(".scenario-panel");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.getAttribute("data-scenario");
    tabs.forEach((t) => {
      const active = t === tab;
      t.classList.toggle("active", active);
      t.setAttribute("aria-selected", active ? "true" : "false");
    });
    panels.forEach((panel) => {
      const match = panel.getAttribute("data-panel") === target;
      panel.classList.toggle("active", match);
      panel.hidden = !match;
    });
  });
});

