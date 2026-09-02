(function () {
  const KEY = "cheragh-kid-v2";
  const TOTAL = 9;
  const IMG = "<img src=x onerror=\"document.querySelector('#lamp').classList.add('on')\">";
  const IMG_MSG = "<img src=x onerror=\"parent.postMessage('LIT','*')\">";
  const HREF = "javascript:void(document.querySelector('#lamp').classList.add('on'))";
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || { done: {}, notes: {}, voice: false }; }
    catch (e) { return { done: {}, notes: {}, voice: false }; }
  }
  const state = load();
  let current = -1;
  const $ = (s, r) => (r || document).querySelector(s);
  const home = $("#home");
  const lesson = $("#lesson");
  const welcome = $("#welcome");
  const toast = $("#toast");
  const dictBox = $("#dict");
  function save() {
    localStorage.setItem(KEY, JSON.stringify(state));
    drawHome();
    drawDict();
  }
  function say(t) {
    toast.textContent = t;
    toast.classList.add("show");
    setTimeout(function () { toast.classList.remove("show"); }, 1700);
    if (state.voice) speak(t);
  }
  function speak(t) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(t);
    u.lang = "fa-IR";
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
  }
  const levels = [
    { id: 0, title: "اتاق بازی", blurb: "بنویس و دکمه را بزن. صفحه جواب می‌دهد.", word: "صفحه", mean: "همان چیزی که می‌بینی و می‌تواند عوض شود." },
    { id: 1, title: "دو جعبه", blurb: "یک نوشته در دو جعبه می‌رود. یکی حرف است، یکی دستور.", word: "دستور", mean: "حرفی که صفحه انجامش می‌دهد، نه فقط نشانش می‌دهد." },
    { id: 2, title: "لگوهای صفحه", blurb: "یاد می‌گیری تگ یعنی برچسب دور حرف.", word: "تگ", mean: "برچسب کوچکی دور حرف؛ شبیه لگو." },
    { id: 3, title: "لگوی جادویی", blurb: "بعضی تکه‌ها کار هم می‌کنند.", word: "رویداد", mean: "اتفاقی مثل خطا یا کلیک که یک تکه می‌تواند به آن جواب بدهد." },
    { id: 4, title: "جیب آدرس", blurb: "ته لینک هم می‌تواند صفحه را عوض کند.", word: "ورودی", mean: "جایی که حرف تو وارد صفحه می‌شود." },
    { id: 5, title: "دربان تنبل", blurb: "اگر یک کلمه را ممنوع کنند، راه دیگری هست.", word: "فیلتر", mean: "دربانی که بعضی کلمه‌ها را پاک می‌کند." },
    { id: 6, title: "جای نشستن", blurb: "اگر حرف داخل لینک بنشیند، معنی‌اش عوض می‌شود.", word: "زمینه", mean: "جایی که حرف تو می‌نشیند." },
    { id: 7, title: "دو اتاق", blurb: "یک صفحه برای صفحه دیگر نامه می‌فرستد.", word: "پیام", mean: "نامه‌ای از یک صفحه به صفحه دیگر." },
    { id: 8, title: "دو داستان", blurb: "فرق کار به‌جای تو با خواندن دفتر تو.", word: "دربان مرورگر", mean: "قانونی که نمی‌گذارد یک سایت نامه سایت دیگر را بخواند." }
  ];
  function unlocked(id) {
    if (id === 0) return true;
    return !!(state.done[id - 1] && String(state.notes[id - 1] || "").trim());
  }
  function doneCount() {
    return Object.keys(state.done).filter(function (k) { return state.done[k]; }).length;
  }
  function drawHome() {
    $("#prog-text").textContent = doneCount() + " از " + TOTAL + " اتاق تمام شده";
    $("#prog-bar").style.width = Math.round((doneCount() / TOTAL) * 100) + "%";
    var list = $("#level-list");
    if (!list) return;
    list.innerHTML = "";
    levels.forEach(function (lv) {
      var open = unlocked(lv.id);
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "level-card" + (state.done[lv.id] ? " done" : "");
      btn.disabled = !open;
      btn.innerHTML = '<div class="num">' + (state.done[lv.id] ? "✓" : lv.id) + '</div><div class="meta"><h3>' + lv.title + "</h3><p>" + lv.blurb + "</p></div>" + (open ? "" : '<div class="lock">قفل</div>');
      if (open) btn.onclick = function () { openLevel(lv.id); };
      list.appendChild(btn);
    });
  }
  function drawDict() {
    var ul = $("#dict-list");
    ul.innerHTML = "";
    levels.forEach(function (lv) {
      if (!state.done[lv.id]) return;
      var li = document.createElement("li");
      li.innerHTML = "<b>" + lv.word + "</b> — " + lv.mean;
      ul.appendChild(li);
    });
    if (!ul.children.length) {
      ul.innerHTML = "<li>هنوز کلمه‌ای روی دیوار نیست. اول یک اتاق را تمام کن.</li>";
    }
  }
  function mark(id) {
    if (current !== id || state.done[id]) {
      if (state.done[id]) showWin(lesson);
      return;
    }
    state.done[id] = true;
    save();
    showWin(lesson);
    say("آفرین. چراغ روشن شد.");
  }
  function showWin(root) {
    var ok = $(".okbox", root);
    var why = $(".why", root);
    var g = $(".grownup", root);
    if (ok) ok.classList.add("show");
    if (why) why.classList.add("show");
    if (g) g.classList.add("show");
  }
  function showScreen(name) {
    welcome.classList.remove("active");
    home.classList.remove("active");
    lesson.classList.remove("active");
    if (name === "welcome") welcome.classList.add("active");
    if (name === "home") home.classList.add("active");
    if (name === "lesson") lesson.classList.add("active");
  }
  function openLevel(id) {
    current = id;
    showScreen("lesson");
    lesson.innerHTML = "";
    var wrap = document.createElement("div");
    lesson.appendChild(wrap);
    wrap.innerHTML = '<div class="nav-row"><button class="ghost" id="back" type="button">برگشت به خانه‌ها</button><button class="ghost" id="read-lesson" type="button">برایم بخوان</button></div>';
    $("#back", wrap).onclick = function () {
      current = -1;
      showScreen("home");
      drawHome();
    };
    [r0, r1, r2, r3, r4, r5, r6, r7, r8][id](wrap);
    addNotes(wrap, id);
    $("#read-lesson", wrap).onclick = function () {
      var g = $(".goal", wrap);
      speak((g && g.textContent) || levels[id].blurb);
    };
    window.scrollTo(0, 0);
  }
  function shell(wrap, data) {
    wrap.insertAdjacentHTML("beforeend",
      "<h2>" + data.title + "</h2>" +
      '<div class="steps">' +
      '<span class="step-pill">۱ داستان</span>' +
      '<span class="step-pill now">۲ خودت بزن</span>' +
      '<span class="step-pill">۳ اسم بزرگسال</span>' +
      '<span class="step-pill">۴ دفترچه</span></div>' +
      '<div class="goal"><b>کار این اتاق: </b>' + data.goal + "</div>" +
      (data.demo ? '<div class="row"><button class="tiny" id="demo" type="button">ببین چطور</button></div>' : "") +
      '<div class="lab-box" id="arena"></div>' +
      '<div class="hints"><div class="row">' +
      '<button class="tiny" data-h="1" type="button">یک هل کوچک</button>' +
      '<button class="tiny" data-h="2" type="button">یک مثال</button>' +
      '<button class="tiny" data-h="3" type="button">دست معلم</button></div>' +
      '<div class="hint-layer" id="h1">' + data.h1 + "</div>" +
      '<div class="hint-layer" id="h2">' + data.h2 + "</div>" +
      '<div class="hint-layer" id="h3">' + data.h3 + "</div></div>" +
      '<div class="okbox">پیدا کردی. چراغ روشن شد.</div>' +
      '<div class="why">' + data.why + "</div>" +
      '<div class="grownup"><b>اسم بزرگسال: </b>' + data.grown + "</div>"
    );
    wrap.querySelectorAll("[data-h]").forEach(function (b) {
      b.onclick = function () { $("#h" + b.getAttribute("data-h"), wrap).classList.toggle("show"); };
    });
    if (state.done[data.id]) showWin(wrap);
    return $("#arena", wrap);
  }
  function addNotes(wrap, id) {
    var box = document.createElement("div");
    box.className = "lab-box";
    box.innerHTML = "<h3>دفترچه</h3><label>با زبان خودت بگو دیدی چه شد. تا ننویسی، اتاق بعد باز نمی‌شود.</label><textarea id=\"note\" placeholder=\"مثلاً: جعبه زرد نوشته را دستور دید...\"></textarea><div class=\"row\"><button id=\"save-note\" type=\"button\">ذخیره جمله</button></div>";
    wrap.appendChild(box);
    $("#note", box).value = state.notes[id] || "";
    $("#save-note", box).onclick = function () {
      var t = $("#note", box).value.trim();
      if (!t) { say("یک جمله بنویس"); return; }
      if (!state.done[id]) { say("اول کار اتاق را تمام کن"); return; }
      state.notes[id] = t;
      save();
      say("ذخیره شد. اتاق بعد باز است.");
    };
  }
  function watchLamp(lamp, id) {
    new MutationObserver(function () {
      if (lamp.classList.contains("on")) mark(id);
    }).observe(lamp, { attributes: true });
  }
  function bindDemo(wrap, fn) {
    var b = $("#demo", wrap);
    if (b) b.onclick = fn;
  }
  function r0(wrap) {
    var arena = shell(wrap, {
      id: 0, title: "اتاق بازی",
      goal: "اسمت را بنویس و دکمه را بزن. باید سلام ببینی و چراغ روشن شود.",
      demo: true,
      h1: "اول داخل کادر یک اسم بنویس، بعد دکمه را بزن.",
      h2: "مثلاً بنویس: مبینا",
      h3: "هر اسمی کافی است. مهم این است که سلام بیاید.",
      why: "صفحه مثل یک اتاق است. تو حرف می‌زنی، اتاق جواب می‌دهد. برنامه‌نویسی همین است.",
      grown: "به این می‌گویند صفحه وب. هنوز هیچ کلمه سختی لازم نیست."
    });
    arena.innerHTML = "<h3>دیوار اتاق</h3><div class=\"lamp\" id=\"lamp\"></div><label>اسم تو</label><input id=\"name\" type=\"text\" placeholder=\"اینجا بنویس\" /><div class=\"row\"><button class=\"primary\" id=\"go\" type=\"button\">سلام کن</button></div><div class=\"pane\"><b>جواب اتاق</b><div class=\"sink\" id=\"out\">هنوز چیزی نگفته‌ای</div></div>";
    function run(n) {
      if (!n) { say("یک اسم بنویس"); return; }
      $("#out", arena).textContent = "سلام " + n + "، خوش آمدی.";
      $("#lamp", arena).classList.add("on");
      mark(0);
    }
    $("#go", arena).onclick = function () { run($("#name", arena).value.trim()); };
    bindDemo(wrap, function () {
      $("#name", arena).value = "دوست من";
      run("دوست من");
    });
  }
  function r1(wrap) {
    var arena = shell(wrap, {
      id: 1, title: "دو جعبه",
      goal: "چیزی بنویس که در یک جعبه فقط نوشته باشد و در جعبه دیگر درشت دیده شود.",
      demo: true,
      h1: "باید دور حرف یک علامت مخصوص بگذاری.",
      h2: "این را عیناً بنویس: <b>سلام</b>",
      h3: "همان <b>سلام</b> را بگذار و دکمه را بزن.",
      why: "یک جعبه حرف را همان‌طور که هست نشان می‌دهد. جعبه دیگر همان حرف را دستور می‌بیند.",
      grown: "جعبه حرف یعنی textContent. جعبه دستور یعنی innerHTML."
    });
    arena.innerHTML = "<label>این را در هر دو جعبه بریز</label><input id=\"inp\" type=\"text\" /><div class=\"row\"><button class=\"primary\" id=\"go\" type=\"button\">بریز داخل جعبه‌ها</button></div><div class=\"compare\"><div class=\"pane\"><b>جعبه حرف</b><div class=\"sink\" id=\"safe\"></div></div><div class=\"pane\"><b>جعبه دستور</b><div class=\"sink\" id=\"unsafe\"></div></div></div>";
    function run(v) {
      $("#safe", arena).textContent = v;
      $("#unsafe", arena).innerHTML = v;
      if ($("#unsafe", arena).querySelector("b,strong,i,em,u")) mark(1);
    }
    $("#go", arena).onclick = function () { run($("#inp", arena).value); };
    bindDemo(wrap, function () {
      $("#inp", arena).value = "<b>سلام</b>";
      run("<b>سلام</b>");
    });
  }
  function r2(wrap) {
    var arena = shell(wrap, {
      id: 2, title: "لگوهای صفحه",
      goal: "سه سؤال را درست جواب بده.",
      demo: false,
      h1: "تگ یعنی یک برچسب دور حرف.",
      h2: "<b> یعنی درشت.",
      h3: "جواب‌ها: برچسب دور حرف / درشت می‌شود / دستور است",
      why: "صفحه از تکه‌های کوچک ساخته شده. به این تکه‌ها می‌گویند تگ.",
      grown: "تگ همان HTML tag است. مثل <b> یا <img>."
    });
    var qs = [
      { q: "تگ یعنی چه؟", opts: ["یک رنگ", "یک برچسب دور حرف", "اسم سایت"], a: 1 },
      { q: "اگر بنویسی <b>گل</b> چه می‌شود؟", opts: ["گل درشت دیده می‌شود", "سایت خاموش می‌شود", "هیچ"], a: 0 },
      { q: "جعبه دستور، تگ را چه می‌بیند؟", opts: ["نقاشی", "دستور", "رمز عبور"], a: 1 }
    ];
    var html = '<div class="arena-quiz">';
    qs.forEach(function (item, i) {
      html += "<p><b>" + (i + 1) + ". </b>" + item.q + "</p>";
      item.opts.forEach(function (o, j) {
        html += '<button type="button" data-q="' + i + '" data-i="' + j + '">' + o + "</button>";
      });
    });
    html += "<p id='score'></p></div>";
    arena.innerHTML = html;
    var picked = {};
    arena.querySelectorAll("button[data-q]").forEach(function (b) {
      b.onclick = function () {
        var q = +b.getAttribute("data-q");
        var i = +b.getAttribute("data-i");
        picked[q] = i;
        arena.querySelectorAll('button[data-q="' + q + '"]').forEach(function (x) { x.style.borderColor = "#ead9b6"; });
        b.style.borderColor = "#f0b429";
        if (Object.keys(picked).length === 3) {
          var ok = qs.every(function (item, idx) { return picked[idx] === item.a; });
          $("#score", arena).textContent = ok ? "هر سه درست بود." : "یکی را دوباره فکر کن.";
          if (ok) mark(2);
        }
      };
    });
  }
  function r3(wrap) {
    var arena = shell(wrap, {
      id: 3, title: "لگوی جادویی",
      goal: "یک تصویر خراب بساز که وقتی پیدا نشد، چراغ را روشن کند.",
      demo: true,
      h1: "تصویری بساز که وجود ندارد.",
      h2: "بعضی تصویرها وقتی خراب می‌شوند یک کار اضافه می‌کنند.",
      h3: IMG,
      why: "بعضی تکه‌ها منتظر یک اتفاق‌اند. وقتی اتفاق افتاد، کار دیگری هم انجام می‌شود.",
      grown: "این رویداد onerror روی تگ img است. به این می‌گویند event handler."
    });
    arena.innerHTML = "<div class=\"lamp\" id=\"lamp\"></div><label>اینجا یک تکه لگو بگذار</label><input id=\"inp\" type=\"text\" /><div class=\"row\"><button class=\"primary\" id=\"go\" type=\"button\">بگذار روی میز</button></div><div class=\"sink\" id=\"out\"></div>";
    watchLamp($("#lamp", arena), 3);
    $("#go", arena).onclick = function () { $("#out", arena).innerHTML = $("#inp", arena).value; };
    bindDemo(wrap, function () {
      $("#inp", arena).value = IMG;
      $("#out", arena).innerHTML = IMG;
    });
  }
  function r4(wrap) {
    var arena = shell(wrap, {
      id: 4, title: "جیب آدرس",
      goal: "چیزی در کادر آدرس بگذار که چراغ روشن شود.",
      demo: true,
      h1: "کادر آدرس هم یک ورودی است.",
      h2: "همان لگوی تصویر خراب اتاق قبل را اینجا هم می‌شود گذاشت.",
      h3: IMG,
      why: "ته لینک هم ورودی است. صفحه آن را برمی‌دارد و روی میز می‌گذارد.",
      grown: "این ورودی را source می‌گویند. گذاشتنش روی میز sink است. مثل location.hash + innerHTML."
    });
    arena.innerHTML = "<div class=\"lamp\" id=\"lamp\"></div><label>ته لینک فرضی</label><input id=\"inp\" type=\"text\" /><div class=\"row\"><button class=\"primary\" id=\"go\" type=\"button\">بگذار ته لینک</button></div><div class=\"pane\"><b>صفحه چه دید</b><div class=\"sink\" id=\"out\">سلام مهمان</div></div>";
    watchLamp($("#lamp", arena), 4);
    $("#go", arena).onclick = function () { $("#out", arena).innerHTML = "سلام " + $("#inp", arena).value; };
    bindDemo(wrap, function () {
      $("#inp", arena).value = IMG;
      $("#out", arena).innerHTML = "سلام " + IMG;
    });
  }
  function r5(wrap) {
    var arena = shell(wrap, {
      id: 5, title: "دربان تنبل",
      goal: "اتاق کلمه script را پاک می‌کند. بدون آن کلمه چراغ را روشن کن.",
      demo: true,
      h1: "اگر یک در بسته باشد، از پنجره برو.",
      h2: "از تصویر خراب استفاده کن، نه از کلمه سانسورشده.",
      h3: IMG,
      why: "سانسور یک کلمه جلوی همه کارها را نمی‌گیرد.",
      grown: "این یک فیلتر ضعیف است. WAF ضعیف همین کار را می‌کند."
    });
    arena.innerHTML = "<div class=\"lamp\" id=\"lamp\"></div><input id=\"inp\" type=\"text\" /><div class=\"row\"><button class=\"primary\" id=\"go\" type=\"button\">بفرست</button></div><div class=\"sink\" id=\"out\"></div>";
    watchLamp($("#lamp", arena), 5);
    $("#go", arena).onclick = function () {
      $("#out", arena).innerHTML = $("#inp", arena).value.replace(/script/gi, "");
    };
    bindDemo(wrap, function () {
      $("#inp", arena).value = IMG;
      $("#out", arena).innerHTML = IMG;
    });
  }
  function r6(wrap) {
    var arena = shell(wrap, {
      id: 6, title: "جای نشستن",
      goal: "یک لینک بساز. وقتی روی لینک کلیک شد، چراغ روشن شود.",
      demo: true,
      h1: "این بار حرف تو داخل خود لینک می‌نشیند.",
      h2: "به‌جای آدرس سایت یک دستور کوچک بگذار.",
      h3: HREF,
      why: "جای نشستن حرف، معنی‌اش را عوض می‌کند.",
      grown: "این می‌شود javascript: داخل href. زمینه فرق دارد."
    });
    arena.innerHTML = "<div class=\"lamp\" id=\"lamp\"></div><label>داخل لینک چه نوشته شود؟</label><input id=\"inp\" type=\"text\" value=\"https://example.com\" /><div class=\"row\"><button class=\"primary\" id=\"go\" type=\"button\">لینک را بساز</button></div><div id=\"out\"></div>";
    watchLamp($("#lamp", arena), 6);
    $("#go", arena).onclick = function () {
      $("#out", arena).innerHTML = '<a href="' + $("#inp", arena).value + '">روی من کلیک کن</a>';
    };
    bindDemo(wrap, function () {
      $("#inp", arena).value = HREF;
      $("#out", arena).innerHTML = '<a href="' + HREF + '">روی من کلیک کن</a>';
    });
  }
  function r7(wrap) {
    var arena = shell(wrap, {
      id: 7, title: "دو اتاق",
      goal: "به اتاق بغلی پیامی بفرست که چراغ این‌جا روشن شود.",
      demo: true,
      h1: "اتاق بغلی هر نامه را روی میز می‌گذارد.",
      h2: "نامه را مثل لگوی تصویر خراب بفرست و از او بخواه به تو خبر بدهد.",
      h3: IMG_MSG,
      why: "اگر گیرنده نامه را بدون نگاه کردن روی میز بگذارد، نامه می‌تواند دستور شود.",
      grown: "این postMessage بدون چک کردن origin است."
    });
    arena.innerHTML = "<div class=\"lamp\" id=\"lamp\"></div><iframe class=\"lab\" id=\"child\" src=\"child.html\"></iframe><label>نامه برای اتاق بغلی</label><input id=\"msg\" type=\"text\" /><div class=\"row\"><button class=\"primary\" id=\"send\" type=\"button\">بفرست</button></div>";
    window.addEventListener("message", function (e) {
      if (current !== 7) return;
      if (e.data === "LIT") {
        $("#lamp", arena).classList.add("on");
        mark(7);
      }
    });
    $("#send", arena).onclick = function () {
      $("#child", arena).contentWindow.postMessage($("#msg", arena).value, "*");
    };
    bindDemo(wrap, function () {
      $("#msg", arena).value = IMG_MSG;
      $("#child", arena).contentWindow.postMessage(IMG_MSG, "*");
    });
  }
  function r8(wrap) {
    var arena = shell(wrap, {
      id: 8, title: "دو داستان",
      goal: "برای هر داستان بگو کدام یکی است.",
      demo: false,
      h1: "یکی کار به‌جای تو است. یکی نخواندن جواب است.",
      h2: "داستان ۱ کار به‌جای تو. داستان ۲ دربان. داستان ۳ همان خانه.",
      h3: "۱) کار به‌جای تو  ۲) دربان جلوی خواندن  ۳) همان خانه؛ مانع نیست",
      why: "گاهی لازم نیست جواب را بخوانند؛ کافی است به جای تو کاری انجام شود. گاهی هم می‌خواهند بخوانند و مرورگر راه را می‌بندد.",
      grown: "داستان ۱ نزدیک CSRF است. داستان ۲ همان SOP است. داستان ۳ همان صفحه خودت است."
    });
    var items = [
      { t: "کسی بدون اینکه ببینی، از خانه تو برای بانک دکمه بفرست را می‌زند.", o: ["کار به‌جای تو", "خواندن دفتر تو"], a: 0 },
      { t: "از خانه بغلی می‌خواهند دفتر حساب تو را بخوانند. نامه می‌رود ولی جواب را نشانشان نمی‌دهند.", o: ["دربان جلوی خواندن را گرفت", "دکمه خراب بود"], a: 0 },
      { t: "داخل همان صفحه خودت هستی و دفتر همان صفحه را می‌خوانی.", o: ["دربان مانع است", "همان خانه است؛ مانع نیست"], a: 1 }
    ];
    var html = "";
    items.forEach(function (it, i) {
      html += '<div class="story"><b>داستان ' + (i + 1) + "</b><p>" + it.t + "</p>";
      it.o.forEach(function (opt, j) {
        html += '<button type="button" data-q="' + i + '" data-i="' + j + '">' + opt + "</button>";
      });
      html += "</div>";
    });
    html += "<p id='score'></p>";
    arena.innerHTML = html;
    var picked = {};
    arena.querySelectorAll("button[data-q]").forEach(function (b) {
      b.onclick = function () {
        var q = +b.getAttribute("data-q");
        var i = +b.getAttribute("data-i");
        picked[q] = i;
        arena.querySelectorAll('button[data-q="' + q + '"]').forEach(function (x) { x.style.borderColor = "#ead9b6"; });
        b.style.borderColor = "#f0b429";
        if (Object.keys(picked).length === 3) {
          var ok = items.every(function (it, idx) { return picked[idx] === it.a; });
          $("#score", arena).textContent = ok ? "داستان‌ها را درست جدا کردی." : "یکی را دوباره بخوان.";
          if (ok) mark(8);
        }
      };
    });
  }
  $("#start-home").onclick = function () { showScreen("home"); drawHome(); };
  $("#back-welcome").onclick = function () { showScreen("welcome"); };
  $("#read-welcome").onclick = function () {
    speak("سلام. من چراغک هستم. اینجا یک خانه است. هر اتاق یک کار خیلی کوچک دارد. اول ببین، بعد خودت بزن، بعد بنویس.");
  };
  $("#btn-words").onclick = function () {
    drawDict();
    dictBox.hidden = !dictBox.hidden;
  };
  $("#close-dict").onclick = function () { dictBox.hidden = true; };
  $("#btn-voice").onclick = function () {
    state.voice = !state.voice;
    save();
    $("#btn-voice").textContent = state.voice ? "صدا خاموش" : "صدا روشن";
    say(state.voice ? "صدا روشن شد" : "صدا خاموش شد");
  };
  $("#btn-voice").textContent = state.voice ? "صدا خاموش" : "صدا روشن";
  $("#reset").onclick = function () {
    if (confirm("از اتاق اول شروع کنیم؟")) {
      localStorage.removeItem(KEY);
      state.done = {};
      state.notes = {};
      state.voice = false;
      $("#btn-voice").textContent = "صدا روشن";
      drawHome();
      drawDict();
      say("از صفر");
    }
  };
  drawHome();
  drawDict();
})();
