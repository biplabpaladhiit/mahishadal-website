/* =========================================================
   Mahishadal Heritage — site behaviour
   Edit the FESTIVALS array below with your real dates.
   Everything else (countdown plaque + event list) updates itself.
   ========================================================= */

const FESTIVALS = [
  { name: "Mahishadal Rathyatra", date: "2026-07-05", description: "The town's chariot festival, drawing visitors from across the district." },
  { name: "Durga Puja", date: "2026-10-19", description: "Community pujas across Mahishadal, including at the Rajbari." },
  { name: "Poush Mela", date: "2026-12-27", description: "Winter fair with local crafts, food stalls, and folk performances." },
  // Add more festivals here as { name, date: "YYYY-MM-DD", description }
];

function daysUntil(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  const diffMs = target - today;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function renderFestivalPlaque() {
  const upcoming = FESTIVALS
    .map(f => ({ ...f, days: daysUntil(f.date) }))
    .filter(f => f.days >= 0)
    .sort((a, b) => a.days - b.days);

  const nameEl = document.getElementById("next-festival-name");
  const countEl = document.getElementById("next-festival-count");
  if (!nameEl || !countEl) return;

  if (upcoming.length === 0) {
    nameEl.textContent = "New festival dates coming soon";
    countEl.textContent = "—";
    return;
  }

  const next = upcoming[0];
  nameEl.textContent = next.name;
  countEl.textContent = next.days === 0 ? "Today" : `${next.days} day${next.days === 1 ? "" : "s"} to go`;
}

function renderEventList() {
  const list = document.getElementById("event-list");
  if (!list) return;

  const upcoming = FESTIVALS
    .map(f => ({ ...f, days: daysUntil(f.date) }))
    .filter(f => f.days >= 0)
    .sort((a, b) => a.days - b.days);

  list.innerHTML = upcoming.map(f => `
    <div class="event-row">
      <div class="event-date">${formatDate(f.date)}</div>
      <div class="event-info">
        <h3>${f.name}</h3>
        <p>${f.description}</p>
      </div>
    </div>
  `).join("");
}

function setupNavToggle() {
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("main-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close menu after tapping a link (useful on mobile)
  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function setFooterYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", () => {
  renderFestivalPlaque();
  renderEventList();
  setupNavToggle();
  setFooterYear();
});
