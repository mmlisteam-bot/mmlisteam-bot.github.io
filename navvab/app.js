const DEFAULTS = {
  theme: {
    burgundy: "#6b1524",
    burgundyDeep: "#4a0e18",
    gold: "#c4a35a",
    goldSoft: "#e8d5a3",
    cream: "#f6f0e4",
    paper: "#fffdf8",
    ink: "#1c1612",
    muted: "#5c5348",
    line: "#d9cbb0",
    green: "#1e3d32",
    radius: "0",
    fontScale: "1"
  },
  chrome: {
    topBrand: "NAVVAB.IR",
    topTag: "یادنامه شهید سید مجتبی نواب صفوی",
    brandTitle: "NAVVAB.IR",
    brandSub: "پایگاه اطلاع‌رسانی یادنامه شهید نواب صفوی",
    footBrand: "NAVVAB.IR",
    footNote: "یادنامه غیررسمی؛ الهام‌گرفته از قالب پایگاه‌های رسمی فارسی.",
    footSrc: "منابع عمومی: ویکی‌پدیا، ویکی‌شیعه، ایرنا."
  },
  home: {
    portrait: "https://commons.wikimedia.org/wiki/Special:FilePath/Navvad_Safavi.jpg",
    kicker: "شهید · طلبه · بنیان‌گذار فدائیان اسلام",
    title: "سید مجتبی نواب صفوی",
    lead: "سید مجتبی میرلوحی، مشهور به نواب صفوی، روحانی مبارز ایرانی و رهبر جمعیت فدائیان اسلام بود. عمر کوتاه سی‌ویک‌ساله‌اش یکی از نخستین جرقه‌های اسلام سیاسی در ایران معاصر شناخته می‌شود.",
    chips: "تولد: ۱۷ مهر ۱۳۰۳ · خانی‌آباد تهران\nشهادت: ۲۷ دی ۱۳۳۴ · تهران\nمدفن: وادی‌السلام قم"
  },
  bio: {
    text: "در خانواده‌ای روحانی در محله خانی‌آباد تهران به دنیا آمد. پدرش سید جواد میرلوحی روحانی بود که در دوره رضاشاه ناچار شد لباس روحانیت را کنار بگذارد.\n\nپس از مدتی کار در شرکت نفت آبادان، برای تحصیل علوم دینی به نجف اشرف رفت و از محضر استادانی چون علامه امینی و آیت‌الله حاج‌آقا حسین قمی بهره برد.\n\nدر بامداد ۲۷ دی ۱۳۳۴ همراه سه تن از یارانش در لشگر ۲ زرهی تهران تیرباران شد.",
    facts: "نام هنگام تولد | سید مجتبی میرلوحی\nهمسر | نیره السادات احتشام رضوی\nتحصیل | حوزه تهران و نجف اشرف\nاثر شاخص | راهنمای حقایق\nشعار | اسلام برتر از همه چیز است"
  },
  timeline: {
    items: "۱۳۰۳ | تولد در خانی‌آباد تهران.\n۱۳۲۲–۱۳۲۳ | عزیمت به آبادان و سپس نجف.\n۱۳۲۴ | اعلام موجودیت جمعیت فدائیان اسلام.\n۱۳۲۷–۱۳۳۲ | حضور در تحولات سیاسی کشور.\n۱۳۳۲ | سفر به مشهد و دیدار با طلاب جوان.\n۱۳۳۴ | محاکمه و تیرباران در ۲۷ دی."
  },
  fadaiyan: {
    text: "جمعیت فدائیان اسلام در اسفند ۱۳۲۴ با بیانیه‌ای به نام «دین و انتقام» اعلام موجودیت کرد. هدف اعلان‌شدهٔ گروه مقابله با بی‌دینی و فساد سیاسی و زمینه‌سازی برای حکومت اسلامی بود.\n\nکتاب «راهنمای حقایق» مهم‌ترین متن برنامه‌ای نواب است."
  },
  quotes: {
    items: "مرحوم شهید نواب صفوی نخستین جرقه‌ای بود که راه اسلام را به معنای فراگیر انقلابی و پویای آن در برابرم روشن ساخت. | آیت‌الله سید علی خامنه‌ای — خاطره دیدار مشهد، ۱۳۳۲"
  },
  yar: {
    items: "خلیل طهماسبی | تیرباران ۲۷ دی ۱۳۳۴\nمظفرعلی ذوالقدر | تیرباران ۲۷ دی ۱۳۳۴\nسید محمد واحدی | تیرباران ۲۷ دی ۱۳۳۴\nسید عبدالحسین واحدی | از رهبران تشکیلات فدائیان اسلام"
  }
};

const KEY = "navvab-site-v2";
const PASS_KEY = "navvab-admin-pass";
const DEFAULT_PASS = "navvab";

function loadState() {
  try { return Object.assign(JSON.parse(JSON.stringify(DEFAULTS)), JSON.parse(localStorage.getItem(KEY) || "null")); }
  catch { return JSON.parse(JSON.stringify(DEFAULTS)); }
}
function saveState(s) { localStorage.setItem(KEY, JSON.stringify(s)); }
let state = loadState();
state.theme = Object.assign({}, DEFAULTS.theme, state.theme);
state.chrome = Object.assign({}, DEFAULTS.chrome, state.chrome);
state.home = Object.assign({}, DEFAULTS.home, state.home);
state.bio = Object.assign({}, DEFAULTS.bio, state.bio);
state.timeline = Object.assign({}, DEFAULTS.timeline, state.timeline);
state.fadaiyan = Object.assign({}, DEFAULTS.fadaiyan, state.fadaiyan);
state.quotes = Object.assign({}, DEFAULTS.quotes, state.quotes);
state.yar = Object.assign({}, DEFAULTS.yar, state.yar);

function applyTheme() {
  const t = state.theme;
  const r = document.documentElement.style;
  r.setProperty("--burgundy", t.burgundy);
  r.setProperty("--burgundy-deep", t.burgundyDeep);
  r.setProperty("--gold", t.gold);
  r.setProperty("--gold-soft", t.goldSoft);
  r.setProperty("--cream", t.cream);
  r.setProperty("--paper", t.paper);
  r.setProperty("--ink", t.ink);
  r.setProperty("--muted", t.muted);
  r.setProperty("--line", t.line);
  r.setProperty("--green", t.green);
  r.setProperty("--radius", (t.radius || "0") + "px");
  r.setProperty("--font-scale", t.fontScale || "1");
}
function para(text) {
  return (text || "").split(/\n+/).filter(Boolean).map(p => `<p style="margin-bottom:12px">${esc(p)}</p>`).join("");
}
function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function lines(block) {
  return (block || "").split("\n").map(l => l.trim()).filter(Boolean);
}
function render() {
  applyTheme();
  const c = state.chrome, h = state.home;
  document.title = c.brandTitle + " | " + h.title;
  topBrand.textContent = c.topBrand;
  topTag.textContent = c.topTag;
  brandTitle.textContent = c.brandTitle;
  brandSub.textContent = c.brandSub;
  footBrand.textContent = c.footBrand;
  footNote.textContent = c.footNote;
  footSrc.textContent = c.footSrc;
  portrait.src = h.portrait;
  heroKicker.textContent = h.kicker;
  heroTitle.textContent = h.title;
  heroLead.textContent = h.lead;
  heroChips.innerHTML = lines(h.chips).map(x => `<span class="chip">${esc(x)}</span>`).join("");
  bioText.innerHTML = para(state.bio.text);
  bioFacts.innerHTML = lines(state.bio.facts).map(row => {
    const [k, v] = row.split("|").map(s => (s || "").trim());
    return `<dt>${esc(k)}</dt><dd>${esc(v || "")}</dd>`;
  }).join("");
  timelineBox.innerHTML = lines(state.timeline.items).map(row => {
    const [y, t] = row.split("|").map(s => (s || "").trim());
    return `<div class="t-item"><div class="year">${esc(y)}</div><p>${esc(t || "")}</p></div>`;
  }).join("");
  fadaiyanText.innerHTML = para(state.fadaiyan.text);
  quotesBox.innerHTML = lines(state.quotes.items).map(row => {
    const [q, cite] = row.split("|").map(s => (s || "").trim());
    return `<div class="quote" style="margin-bottom:16px"><p>${esc(q)}</p><cite>${esc(cite || "")}</cite></div>`;
  }).join("");
  yarBox.innerHTML = lines(state.yar.items).map(row => {
    const [n, d] = row.split("|").map(s => (s || "").trim());
    return `<article><strong>${esc(n)}</strong><p>${esc(d || "")}</p></article>`;
  }).join("");
}
function route() {
  const path = (location.hash.replace(/^#/, "") || "/");
  const map = { "/": "home", "/bio": "bio", "/timeline": "timeline", "/fadaiyan": "fadaiyan", "/quotes": "quotes", "/yar": "yar" };
  const key = map[path] || "home";
  document.querySelectorAll(".page").forEach(p => p.classList.remove("on"));
  document.getElementById("page-" + key).classList.add("on");
  document.querySelectorAll("nav a").forEach(a => a.classList.toggle("active", a.dataset.route === path));
  window.scrollTo(0, 0);
}
const TABS = [
  ["theme", "ظاهر"],
  ["chrome", "سربرگ"],
  ["home", "خانه"],
  ["bio", "زندگینامه"],
  ["timeline", "خط‌زمان"],
  ["fadaiyan", "فدائیان"],
  ["quotes", "سخنان"],
  ["yar", "یاران"]
];
function field(id, label, value, area) {
  return `<label class="f">${label}</label>${area ? `<textarea data-k="${id}">${esc(value || "")}</textarea>` : `<input data-k="${id}" value="${esc(value || "")}" />`}`;
}
function colorField(id, label, value) {
  return `<label class="f">${label}</label><div class="row2"><input type="color" data-k="${id}" value="${esc(value)}" /><input data-k="${id}" value="${esc(value)}" /></div>`;
}
function drawAdmin(tab) {
  adminTabs.innerHTML = TABS.map(([id, name]) => `<button type="button" data-tab="${id}" class="${id===tab?"on":""}">${name}</button>`).join("");
  let html = "";
  if (tab === "theme") {
    const t = state.theme;
    html = colorField("burgundy", "زرشکی", t.burgundy)
      + colorField("burgundyDeep", "زرشکی تیره", t.burgundyDeep)
      + colorField("gold", "طلایی", t.gold)
      + colorField("goldSoft", "طلایی روشن", t.goldSoft)
      + colorField("cream", "پس‌زمینه", t.cream)
      + colorField("paper", "کارت", t.paper)
      + colorField("ink", "متن", t.ink)
      + colorField("green", "سبز تیره هیرو", t.green)
      + field("radius", "گردی گوشه (پیکسل)", t.radius)
      + field("fontScale", "مقیاس فونت", t.fontScale);
  } else if (tab === "chrome") {
    const c = state.chrome;
    html = field("topBrand", "نوار بالا — راست", c.topBrand)
      + field("topTag", "نوار بالا — چپ", c.topTag)
      + field("brandTitle", "لوگوی هدر", c.brandTitle)
      + field("brandSub", "زیرلوگو", c.brandSub)
      + field("footBrand", "فوتر — عنوان", c.footBrand)
      + field("footNote", "فوتر — توضیح", c.footNote, true)
      + field("footSrc", "فوتر — منابع", c.footSrc, true);
  } else if (tab === "home") {
    const h = state.home;
    html = field("portrait", "آدرس تصویر پرتره", h.portrait)
      + field("kicker", "خط کوچک بالای عنوان", h.kicker)
      + field("title", "عنوان اصلی", h.title)
      + field("lead", "متن معرفی", h.lead, true)
      + field("chips", "چیپ‌ها (هر خط یک مورد)", h.chips, true);
  } else if (tab === "bio") {
    html = field("text", "متن زندگینامه", state.bio.text, true)
      + field("facts", "مشخصات (هر خط: عنوان | مقدار)", state.bio.facts, true);
  } else if (tab === "timeline") {
    html = field("items", "هر خط: سال | توضیح", state.timeline.items, true);
  } else if (tab === "fadaiyan") {
    html = field("text", "متن صفحه فدائیان", state.fadaiyan.text, true);
  } else if (tab === "quotes") {
    html = field("items", "هر خط: نقل‌قول | منبع", state.quotes.items, true);
  } else if (tab === "yar") {
    html = field("items", "هر خط: نام | توضیح", state.yar.items, true);
  }
  adminBody.innerHTML = `<div class="admin-sec on">${html}</div>`;
  adminBody.querySelectorAll("[data-k]").forEach(el => {
    el.addEventListener("input", () => {
      const k = el.dataset.k;
      if (tab === "theme") {
        state.theme[k] = el.value;
        adminBody.querySelectorAll(`[data-k="${k}"]`).forEach(x => { if (x !== el) x.value = el.value; });
        applyTheme();
      } else {
        state[tab][k] = el.value;
        render();
      }
    });
  });
}
let currentTab = "theme";
let logged = sessionStorage.getItem("navvab-ok") === "1";
function openAdmin() {
  overlay.classList.add("on");
  loginBox.style.display = logged ? "none" : "block";
  adminBox.style.display = logged ? "block" : "none";
  if (logged) drawAdmin(currentTab);
}
function closeAdmin() { overlay.classList.remove("on"); }
adminFab.onclick = openAdmin;
closeAdmin.onclick = closeAdmin;
overlay.addEventListener("click", e => { if (e.target === overlay) closeAdmin(); });
loginBtn.onclick = () => {
  const saved = localStorage.getItem(PASS_KEY) || DEFAULT_PASS;
  if (passInput.value === saved) {
    logged = true;
    sessionStorage.setItem("navvab-ok", "1");
    openAdmin();
  } else alert("رمز نادرست است.");
};
adminTabs.addEventListener("click", e => {
  const t = e.target.dataset.tab;
  if (!t) return;
  currentTab = t;
  drawAdmin(t);
});
saveBtn.onclick = () => { saveState(state); render(); alert("ذخیره شد."); };
resetBtn.onclick = () => {
  if (!confirm("همه تغییرات پاک شود؟")) return;
  state = JSON.parse(JSON.stringify(DEFAULTS));
  saveState(state);
  render();
  drawAdmin(currentTab);
};
exportBtn.onclick = () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "navvab-site.json";
  a.click();
};
importFile.onchange = e => {
  const f = e.target.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = () => {
    try {
      state = Object.assign(JSON.parse(JSON.stringify(DEFAULTS)), JSON.parse(r.result));
      saveState(state);
      render();
      drawAdmin(currentTab);
    } catch { alert("فایل نامعتبر است."); }
  };
  r.readAsText(f);
};
setPassBtn.onclick = () => {
  if (!newPass.value.trim()) return;
  localStorage.setItem(PASS_KEY, newPass.value.trim());
  alert("رمز عوض شد.");
  newPass.value = "";
};
window.addEventListener("hashchange", route);
render();
route();
