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
  `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code` +
  `&timezone=Asia%2FKolkata`;

const WEATHER_ICONS = {
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"></path></svg>',
  cloud: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 18h10a4 4 0 0 0 0-8 5.5 5.5 0 0 0-10.7 1.6A3.5 3.5 0 0 0 7 18Z"></path></svg>',
  rain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 15h9a4 4 0 0 0 0-8 5.5 5.5 0 0 0-10.7 1.6A3.5 3.5 0 0 0 7 15Z"></path><path d="M8 19l-1 2M12 19l-1 2M16 19l-1 2"></path></svg>',
  storm: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 14h9a4 4 0 0 0 0-8 5.5 5.5 0 0 0-10.7 1.6A3.5 3.5 0 0 0 7 14Z"></path><path d="M12 15l-2 4h3l-2 4"></path></svg>',
  fog: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 8h16M4 12h16M4 16h10"></path></svg>',
};

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

async function loadWeather() {
  const widgetEl = document.getElementById("weather-widget");
  const iconEl = document.getElementById("weather-icon");
  const tempEl = document.getElementById("weather-temp");
  const descEl = document.getElementById("weather-desc");
  const metaEl = document.getElementById("weather-meta");
  if (!tempEl || !descEl) return;

  try {
    const response = await fetch(WEATHER_URL);
    if (!response.ok) throw new Error("Weather request failed");
    const data = await response.json();
    const current = data.current;
    const info = getWeatherInfo(current.weather_code);
    const humidity = Math.round(current.relative_humidity_2m);
    const feelsLike = Math.round(current.apparent_temperature);

    tempEl.textContent = `${Math.round(current.temperature_2m)}°সে`;
    descEl.textContent = info.desc;
    metaEl.textContent = `আর্দ্রতা ${humidity}% · অনুভূত হচ্ছে ${feelsLike}°সে`;
    iconEl.innerHTML = WEATHER_ICONS[info.icon];
    if (widgetEl) {
      widgetEl.title = `মহিষাদল — ${info.desc} · আর্দ্রতা ${humidity}% · অনুভূত হচ্ছে ${feelsLike}°সে`;
    }
  } catch (err) {
    descEl.textContent = "আবহাওয়ার তথ্য পাওয়া যায়নি";
    metaEl.textContent = "মহিষাদল";
    if (widgetEl) widgetEl.title = "আবহাওয়ার তথ্য পাওয়া যায়নি";
  }
}

document.addEventListener("DOMContentLoaded", loadWeather);
// পাতাটি খোলা থাকলে প্রতি ১৫ মিনিটে আবহাওয়া নতুন করে লোড হবে
setInterval(loadWeather, 15 * 60 * 1000);
