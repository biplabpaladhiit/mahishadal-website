/* =========================================================
   Mahishadal Heritage — সাইট বিহেভিয়ার
   নিচের FESTIVALS তালিকায় আপনার আসল তারিখ ও বিবরণ বসান।
   বাকি সব (কাউন্টডাউন প্লেট + উৎসব তালিকা) নিজে থেকেই আপডেট হবে।
   ========================================================= */

const FESTIVALS = [
  { name: "মহিষাদল রথযাত্রা", date: "2026-07-05", description: "শহরের নিজস্ব রথযাত্রা উৎসব, যা জেলা জুড়ে দর্শনার্থী টেনে আনে।" },
  { name: "দুর্গাপূজা", date: "2026-10-19", description: "মহিষাদল জুড়ে সাম্প্রদায়িক পূজা, রাজবাড়িতেও অনুষ্ঠিত হয়।" },
  { name: "পৌষ মেলা", date: "2026-12-27", description: "শীতকালীন মেলা — স্থানীয় হস্তশিল্প, খাবারের স্টল ও লোকসংগীত সহ।" },
  // এখানে { name, date: "YYYY-MM-DD", description } আকারে নতুন উৎসব যোগ করুন
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
  // bn-BD লোকেল বাংলা সংখ্যা ও মাসের নাম দেখায় (যেমন: ৫ জুলাই)
  return d.toLocaleDateString("bn-BD", { day: "numeric", month: "short" });
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
    nameEl.textContent = "নতুন উৎসবের তারিখ শীঘ্রই আসছে";
    countEl.textContent = "—";
    return;
  }

  const next = upcoming[0];
  nameEl.textContent = next.name;
  countEl.textContent = next.days === 0 ? "আজ" : `আর ${next.days} দিন বাকি`;
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

  // মোবাইলে লিঙ্কে ট্যাপ করার পর মেনু বন্ধ হয়ে যাবে
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
