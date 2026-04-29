// 12309 Calibri Ln (v2) — gallery lightbox, scenario tabs, modals, Leaflet map.

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
  if (!lightbox.hidden) {
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowLeft") navPhoto(-1);
    else if (e.key === "ArrowRight") navPhoto(1);
    return;
  }
  if (e.key === "Escape") closeAllModals();
});

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

// ---------- Modals (contact + apply) ----------
const contactModal = document.getElementById("contact-modal");
const applyModal = document.getElementById("apply-modal");

function openModal(modal) {
  if (!modal) return;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
}
function closeModal(modal) {
  if (!modal) return;
  modal.hidden = true;
  document.body.style.overflow = "";
}
function closeAllModals() {
  closeModal(contactModal);
  closeModal(applyModal);
}

document.getElementById("open-contact")?.addEventListener("click", () => openModal(contactModal));
document.getElementById("contact-close")?.addEventListener("click", () => closeModal(contactModal));
contactModal?.addEventListener("click", (e) => {
  if (e.target === contactModal) closeModal(contactModal);
});

const openApplyHandler = () => openModal(applyModal);
document.getElementById("open-apply")?.addEventListener("click", openApplyHandler);
document.getElementById("open-apply-2")?.addEventListener("click", openApplyHandler);
document.getElementById("apply-close")?.addEventListener("click", () => closeModal(applyModal));
applyModal?.addEventListener("click", (e) => {
  if (e.target === applyModal) closeModal(applyModal);
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

// ---------- Leaflet map ----------
function initMap() {
  if (typeof L === "undefined") return;
  const propertyCoords = [30.4015, -97.6655];

  const map = L.map("map", {
    scrollWheelZoom: false,
    zoomControl: true,
  }).setView(propertyCoords, 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  const homeIcon = L.divIcon({
    className: "home-pin",
    html: '<div style="background:#006aff;color:white;border-radius:999px;padding:6px 10px;font-weight:700;font-size:12px;box-shadow:0 4px 12px rgba(0,0,0,.35);white-space:nowrap;">$2,750/mo</div>',
    iconSize: null,
    iconAnchor: [40, 16],
  });
  L.marker(propertyCoords, { icon: homeIcon })
    .addTo(map)
    .bindPopup("<strong>12309 Calibri Ln</strong><br>5 bd · 3 ba · 2,662 sqft");

  const refs = [
    { coords: [30.4015, -97.7252], label: "Domain · 10", color: "#1f7a4d" },
    { coords: [30.4400, -97.7150], label: "Apple Parmer · 9", color: "#5b27a8" },
    { coords: [30.3965, -97.6710], label: "HEB · 5", color: "#cf2b2b" },
    { coords: [30.4046, -97.6655], label: "Copperfield Park · 2", color: "#3b6e22" },
    { coords: [30.2672, -97.7431], label: "Downtown · 18", color: "#0c1b33" },
  ];

  refs.forEach((r) => {
    L.marker(r.coords, {
      icon: L.divIcon({
        className: "ref-pin",
        html: `<div style="background:${r.color};color:white;border-radius:999px;padding:4px 8px;font-weight:600;font-size:11px;box-shadow:0 2px 6px rgba(0,0,0,.3);white-space:nowrap;">${r.label}</div>`,
        iconAnchor: [30, 12],
      }),
    }).addTo(map);
  });

  map.on("click", () => map.scrollWheelZoom.enable());
}

if (document.readyState === "complete" || document.readyState === "interactive") {
  setTimeout(initMap, 0);
} else {
  document.addEventListener("DOMContentLoaded", initMap);
}
