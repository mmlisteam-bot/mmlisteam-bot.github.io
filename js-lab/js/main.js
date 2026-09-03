const KEY = "js-lab-v5";
const $ = (s, r=document) => r.querySelector(s);
const toast = (m) => { const t=$("#toast"); t.textContent=m; t.classList.add("show"); setTimeout(()=>t.classList.remove("show"), 2400); };

const mods = [
  { id:"m1", title:"DOM / BOM و Source–Sink", topic:"مبانی",
    blurb:"window ⊃ document ⊃ Node. دادهٔ کنترل‌پذیر از Source تا Sink اجرایی." },
  { id:"m2", title:"Injection Contexts", topic:"XSS",
    blurb:"بدنهٔ HTML، attribute نقل‌قول‌شده، URL sink و رشتهٔ JS — هر کدام payload جدا." },
  { id:"m3", title:"Sinkهای HTML: innerHTML و insertAdjacentHTML", topic:"DOM XSS",
    blurb:"اسکریپت parser-inserted در برابر gadget رویداد (onerror / onload)." },
  { id:"m4", title:"XHR / Fetch · responseType و credentials", topic:"AJAX",
    blurb:"readyState، responseType=document، credentials:include." },
  { id:"m5", title:"Same-Origin Policy", topic:"SOP",
    blurb:"سه‌تایی scheme + host + port. SOP جلوی خواندن را می‌گیرد نه ارسال." },
  { id:"m6", title:"پیکربندی غلط CORS", topic:"CORS",
    blurb:"انعکاس ACAO به‌همراه ACAC، ستاره در برابر credentials، Origin تهی، preflight." },
  { id:"m7", title:"window.postMessage", topic:"پنجره‌های متقابل",
    blurb:"targetOrigin ستاره و listener بدون بررسی event.origin." },
  { id:"m8", title:"CSRF · کوکی · SameSite", topic:"CSRF",
    blurb:"درخواست ساده، GET در Lax، دزدیدن توکن با XSS همان origin." },
  { id:"m9", title:"گونه‌های XSS", topic:"XSS",
    blurb:"Reflected / Stored / DOM / Blind / Self. View-Source در برابر DOM زمان اجرا." },
  { id:"m10", title:"Prototype Pollution و دور زدن WAF", topic:"پیشرفته",
    blurb:"گجت __proto__، fromCharCode، bracket notation، ترتیب NFKD و فیلتر." },
];
