/* =========================================================
   মহিষাদলের বর্তমান আবহাওয়া
   Open-Meteo (https://open-meteo.com) থেকে ডেটা আনা হচ্ছে —
   বিনামূল্যে, কোনো API কী ছাড়াই ব্যবহার করা যায়।
   স্থানাঙ্ক: মহিষাদল, পূর্ব মেদিনীপুর (আনুমানিক 22.18°N, 87.83°E)
   ========================================================= */

const WEATHER_LAT = 22.1833;
const WEATHER_LON = 87.8333;
const WEATHER_URL =
  `https://api.open-meteo.com/v1/forecast?latitude=${WEATHER_LAT}&longitude=${WEATHER_LON}` +
  `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m` +
  `&hourly=precipitation_probability&timezone=Asia%2FKolkata`;

const WEATHER_ICONS = {
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"></path></svg>',
  cloud: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 18h10a4 4 0 0 0 0-8 5.5 5.5 0 0 0-10.7 1.6A3.5 3.5 0 0 0 7 18Z"></path></svg>',
  rain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 15h9a4 4 0 0 0 0-8 5.5 5.5 0 0 0-10.7 1.6A3.5 3.5 0 0 0 7 15Z"></path><path d="M8 19l-1 2M12 19l-1 2M16 19l-1 2"></path></svg>',
  storm: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 14h9a4 4 0 0 0 0-8 5.5 5.5 0 0 0-10.7 1.6A3.5 3.5 0 0 0 7 14Z"></path><path d="M12 15l-2 4h3l-2 4"></path></svg>',
  fog: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 8h16M4 12h16M4 16h10"></path></svg>',
};

const WEATHER_ICON_COLOR = {
  sun: "var(--gold)",
  cloud: "var(--indigo-dusk)",
  rain: "var(--indigo-dusk)",
  storm: "var(--terracotta-dark)",
  fog: "var(--ink-soft)",
};

const BN_DIGITS = ["০","১","২","৩","৪","৫","৬","৭","৮","৯"];
const BN_WEEKDAYS = ["রবি","সোম","মঙ্গল","বুধ","বৃহঃ","শুক্র","শনি"];

function toBnDigits(input) {
  return String(input).replace(/[0-9]/g, d => BN_DIGITS[d]);
}

function getDayPeriod(hour24) {
  if (hour24 < 4) return "রাত";
  if (hour24 < 6) return "ভোর";
  if (hour24 < 12) return "সকাল";
  if (hour24 < 16) return "দুপুর";
  if (hour24 < 18) return "বিকাল";
  if (hour24 < 20) return "সন্ধ্যা";
  return "রাত";
}

function getWeatherInfo(code) {
  if (code === 0) return { desc: "পরিষ্কার আকাশ", icon: "sun" };
  if (code === 1 || code === 2) return { desc: "আংশিক মেঘলা", icon: "sun" };
  if (code === 3) return { desc: "মেঘলা", icon: "cloud" };
  if (code === 45 || code === 48) return { desc: "কুয়াশাচ্ছন্ন", icon: "fog" };
  if (code >= 51 && code <= 57) return { desc: "গুঁড়ি গুঁড়ি বৃষ্টি", icon: "rain" };
  if (code >= 61 && code <= 67) return { desc: "বৃষ্টি", icon: "rain" };
  if (code >= 71 && code <= 77) return { desc: "তুষারপাত", icon: "rain" };
  if (code >= 80 && code <= 82) return { desc: "বৃষ্টির ছাঁট", icon: "rain" };
  if (code >= 95) return { desc: "বজ্রসহ ঝড়", icon: "storm" };
  return { desc: "আবহাওয়া", icon: "cloud" };
}

// current.time আসে "YYYY-MM-DDTHH:MM" আকারে (Asia/Kolkata অনুযায়ী)
function formatDateTime(timeStr) {
  const [datePart, timePart] = timeStr.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  const weekday = BN_WEEKDAYS[new Date(year, month - 1, day).getDay()];
  const period = getDayPeriod(hour);
  let hour12 = hour % 12;
  if (hour12 === 0) hour12 = 12;
  const minuteStr = String(minute).padStart(2, "0");
  return `${weekday}, ${period} ${toBnDigits(hour12)}:${toBnDigits(minuteStr)}`;
}

async function loadWeather() {
  const widgetEl = document.getElementById("weather-widget");
  const iconEl = document.getElementById("weather-icon");
  const tempEl = document.getElementById("weather-temp");
  const descEl = document.getElementById("weather-desc");
  const datetimeEl = document.getElementById("weather-datetime");
  const precipEl = document.getElementById("weather-precip");
  const windEl = document.getElementById("weather-wind");
  if (!tempEl || !descEl) return;

  try {
    const response = await fetch(WEATHER_URL);
    if (!response.ok) throw new Error("Weather request failed");
    const data = await response.json();
    const current = data.current;
    const info = getWeatherInfo(current.weather_code);

    // বর্তমান ঘণ্টার সাথে মিলিয়ে বৃষ্টির সম্ভাবনা বের করা
    let precipProb = null;
    if (data.hourly && Array.isArray(data.hourly.time)) {
      const idx = data.hourly.time.indexOf(current.time);
      if (idx !== -1) precipProb = data.hourly.precipitation_probability[idx];
    }

    tempEl.textContent = `${toBnDigits(Math.round(current.temperature_2m))}°সে`;
    descEl.textContent = info.desc;
    datetimeEl.textContent = formatDateTime(current.time);
    precipEl.textContent = precipProb !== null ? `${toBnDigits(Math.round(precipProb))}%` : "—";
    windEl.textContent = `${toBnDigits(Math.round(current.wind_speed_10m))} কিমি/ঘ`;
    iconEl.innerHTML = WEATHER_ICONS[info.icon];
    iconEl.style.color = WEATHER_ICON_COLOR[info.icon];
  } catch (err) {
    descEl.textContent = "আবহাওয়ার তথ্য পাওয়া যায়নি";
    if (datetimeEl) datetimeEl.textContent = "মহিষাদল";
  }
}

document.addEventListener("DOMContentLoaded", loadWeather);
// পাতাটি খোলা থাকলে প্রতি ১৫ মিনিটে আবহাওয়া নতুন করে লোড হবে
setInterval(loadWeather, 15 * 60 * 1000);
