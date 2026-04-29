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

// ---------- Leaflet map ----------
// 12309 Calibri Ln, Austin, TX 78753 — approximate coordinates for the
// Tech Ridge neighborhood. Used as a visual reference, not navigation.
function initMap() {
  if (typeof L === "undefined") return;
  const propertyCoords = [30.4015, -97.6655];

  const map = L.map("map", {
    scrollWheelZoom: false,
    zoomControl: true,
  }).setView(propertyCoords, 14);

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

  // Reference pins — approximate
  const refs = [
    { coords: [30.4015, -97.7252], label: "The Domain", color: "#1f7a4d" },
    { coords: [30.3965, -97.6710], label: "HEB", color: "#cf2b2b" },
    { coords: [30.4046, -97.6655], label: "Copperfield Park", color: "#3b6e22" },
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
