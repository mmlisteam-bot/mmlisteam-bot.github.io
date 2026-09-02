(function () {
  var KEY = 'jssec-kid-v1';
  var TOTAL = 9;
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || { done: {}, notes: {} }; } catch (e) { return { done: {}, notes: {} }; } }
  var state = load();
  var current = -1;
  function save() { localStorage.setItem(KEY, JSON.stringify(state)); drawHome(); }
  function $(s, r) { return (r || document).querySelector(s); }
  var home = $('#home');
  var lesson = $('#lesson');
  var toast = $('#toast');
  function say(t) { toast.textContent = t; toast.classList.add('show'); setTimeout(function () { toast.classList.remove('show'); }, 1600); }
  var levels = [
    { id: 0, title: 'اتاق بازی', blurb: 'بنویس و دکمه را بزن. ببین صفحه جواب می‌دهد.' },
    { id: 1, title: 'دو جعبه', blurb: 'یک نوشته در دو جعبه می‌رود. یکی حرف است، یکی دستور.' },
    { id: 2, title: 'لگوهای صفحه', blurb: 'یاد می‌گیری تگ یعنی چه.' },
    { id: 3, title: 'لگوی جادویی', blurb: 'بعضی تکه‌ها کار هم می‌کنند.' },
    { id: 4, title: 'آدرس هم حرف می‌زند', blurb: 'ته لینک می‌تواند صفحه را عوض کند.' },
    { id: 5, title: 'سانسور ضعیف', blurb: 'اگر یک کلمه را ممنوع کنند، راه دیگری هست.' },
    { id: 6, title: 'جای نشستن', blurb: 'جای نشستن حرف، معنی‌اش را عوض می‌کند.' },
    { id: 7, title: 'دو اتاق', blurb: 'یک صفحه برای صفحه دیگر پیام می‌فرستد.' },
    { id: 8, title: 'دو داستان', blurb: 'فرق کار به‌جای تو با خواندن جواب.' }
  ];
  function unlocked(id) { return id === 0 || !!(state.done[id - 1] && String(state.notes[id - 1] || '').trim()); }
  function doneCount() { return Object.keys(state.done).filter(function (k) { return state.done[k]; }).length; }
  function drawHome() {
    $('#prog-text').textContent = doneCount() + ' از ' + TOTAL + ' اتاق تمام شده';
    $('#prog-bar').style.width = Math.round((doneCount() / TOTAL) * 100) + '%';
    var list = $('#level-list'); list.innerHTML = '';
    levels.forEach(function (lv) {
      var open = unlocked(lv.id);
      var btn = document.createElement('button');
      btn.className = 'level-card' + (state.done[lv.id] ? ' done' : '');
      btn.disabled = !open;
      btn.innerHTML = '<div class="num">' + (state.done[lv.id] ? '✓' : lv.id) + '</div><div class="meta"><h3>' + lv.title + '</h3><p>' + lv.blurb + '</p></div>' + (open ? '' : '<div class="lock">قفل</div>');
      if (open) btn.onclick = function () { openLevel(lv.id); };
      list.appendChild(btn);
    });
  }
  function mark(id) {
    if (current !== id || state.done[id]) return;
    state.done[id] = true; save();
    var ok = $('.okbox'); var why = $('.why');
    if (ok) ok.classList.add('show'); if (why) why.classList.add('show');
    say('آفرین. این اتاق تمام شد.');
  }
  function openLevel(id) {
    current = id; home.classList.remove('active'); lesson.classList.add('active'); lesson.innerHTML = '';
    var wrap = document.createElement('div'); lesson.appendChild(wrap);
    wrap.innerHTML = '<div class="nav-row"><button class="ghost" id="back">برگشت به خانه‌ها</button></div>';
    $('#back', wrap).onclick = function () { current = -1; lesson.classList.remove('active'); home.classList.add('active'); drawHome(); };
    [r0, r1, r2, r3, r4, r5, r6, r7, r8][id](wrap);
    addNotes(wrap, id); window.scrollTo(0, 0);
  }
  function shell(wrap, data) {
    wrap.insertAdjacentHTML('beforeend', '<h2>' + data.title + '</h2><div class="goal"><b>کار این اتاق: </b>' + data.goal + '</div><div class="lab-box" id="arena"></div><div class="hints"><div class="row"><button class="tiny" data-h="1">یک هل کوچک</button><button class="tiny" data-h="2">یک مثال</button><button class="tiny" data-h="3">جواب کامل</button></div><div class="hint-layer" id="h1">' + data.h1 + '</div><div class="hint-layer" id="h2">' + data.h2 + '</div><div class="hint-layer" id="h3">' + data.h3 + '</div></div><div class="okbox">پیدا کردی.</div><div class="why">' + data.why + '</div>' + (data.word ? '<p class="glossary">کلمه تازه: <span class="word">' + data.word + '</span> ' + data.wordMean + '</p>' : ''));
    wrap.querySelectorAll('[data-h]').forEach(function (b) { b.onclick = function () { $('#h' + b.getAttribute('data-h'), wrap).classList.toggle('show'); }; });
    if (state.done[data.id]) { $('.okbox', wrap).classList.add('show'); $('.why', wrap).classList.add('show'); }
    return $('#arena', wrap);
  }
  function addNotes(wrap, id) {
    var box = document.createElement('div'); box.className = 'lab-box';
    box.innerHTML = '<h3>دفترچه</h3><label>با زبان خودت بگو دیدی چه شد. تا ننویسی اتاق بعد باز نمی‌شود.</label><textarea id="note"></textarea><div class="row"><button id="save-note">ذخیره جمله</button></div>';
    wrap.appendChild(box);
    $('#note', box).value = state.notes[id] || '';
    $('#save-note', box).onclick = function () {
      var t = $('#note', box).value.trim();
      if (!t) { say('یک جمله بنویس'); return; }
      if (!state.done[id]) { say('اول کار اتاق را تمام کن'); return; }
      state.notes[id] = t; save(); say('ذخیره شد. اتاق بعد باز است.');
    };
  }
  function watchLamp(lamp, id) { new MutationObserver(function () { if (lamp.classList.contains('on')) mark(id); }).observe(lamp, { attributes: true }); }
  function r0(wrap) {
    var arena = shell(wrap, { id: 0, title: 'اتاق بازی', goal: 'اسمت را بنویس و دکمه را بزن تا چراغ روشن شود.', h1: 'اول اسم بنویس، بعد دکمه را بزن.', h2: 'مثلاً بنویس: مبینا', h3: 'هر اسمی کافی است.', why: 'تو حرف می‌زنی، اتاق جواب می‌دهد. برنامه‌نویسی همین است.', word: 'صفحه', wordMean: 'همان چیزی که الان می‌بینی و می‌تواند عوض شود.' });
    arena.innerHTML = '<div class="lamp" id="lamp"></div><label>اسم تو</label><input id="name" type="text" /><div class="row"><button class="primary" id="go">سلام کن</button></div><div class="pane"><b>جواب اتاق</b><div class="sink" id="out">هنوز چیزی نگفته‌ای</div></div>';
    $('#go', arena).onclick = function () { var n = $('#name', arena).value.trim(); if (!n) { say('یک اسم بنویس'); return; } $('#out', arena).textContent = 'سلام ' + n + '، خوش آمدی.'; $('#lamp', arena).classList.add('on'); mark(0); };
  }
  function r1(wrap) {
    var arena = shell(wrap, { id: 1, title: 'دو جعبه', goal: 'چیزی بنویس که در یک جعبه فقط نوشته باشد و در جعبه دیگر درشت دیده شود.', h1: 'دور حرف یک علامت بگذار.', h2: 'این را بنویس: <b>سلام</b>', h3: 'همان <b>سلام</b> را بگذار و دکمه را بزن.', why: 'یک جعبه فقط نگاه می‌کند. جعبه دیگر دستور را انجام می‌دهد.', word: 'دستور', wordMean: 'حرفی که صفحه انجامش می‌دهد.' });
    arena.innerHTML = '<input id="inp" type="text" /><div class="row"><button class="primary" id="go">بریز داخل جعبه‌ها</button></div><div class="compare"><div class="pane"><b>جعبه حرف</b><div class="sink" id="safe"></div></div><div class="pane"><b>جعبه دستور</b><div class="sink" id="unsafe"></div></div></div>';
    $('#go', arena).onclick = function () { var v = $('#inp', arena).value; $('#safe', arena).textContent = v; $('#unsafe', arena).innerHTML = v; if ($('#unsafe', arena).querySelector('b,strong,i,em,u')) mark(1); };
  }
  function r2(wrap) {
    var arena = shell(wrap, { id: 2, title: 'لگوهای صفحه', goal: 'سه سؤال را درست جواب بده.', h1: 'تگ یعنی برچسب دور حرف.', h2: '<b> یعنی درشت.', h3: 'جواب‌ها: برچسب دور حرف / درشت می‌شود / دستور است', why: 'صفحه از تکه‌های کوچک ساخته شده. به اینها می‌گویند تگ.', word: 'تگ', wordMean: 'برچسب کوچک دور حرف.' });
    var qs = [{ q: 'تگ یعنی چه؟', opts: ['یک رنگ', 'یک برچسب دور حرف', 'اسم سایت'], a: 1 }, { q: 'اگر بنویسی <b>گل</b> چه می‌شود؟', opts: ['گل درشت دیده می‌شود', 'سایت خاموش می‌شود', 'هیچ'], a: 0 }, { q: 'جعبه دستور تگ را چه می‌بیند؟', opts: ['نقاشی', 'دستور', 'رمز'], a: 1 }];
    var html = ''; qs.forEach(function (item, i) { html += '<p><b>' + (i + 1) + '. </b>' + item.q + '</p>'; item.opts.forEach(function (o, j) { html += '<button data-q="' + i + '" data-i="' + j + '">' + o + '</button>'; }); }); html += '<p id="score"></p>'; arena.innerHTML = html;
    var picked = {}; arena.querySelectorAll('button[data-q]').forEach(function (b) { b.onclick = function () { var q = +b.getAttribute('data-q'); var i = +b.getAttribute('data-i'); picked[q] = i; arena.querySelectorAll('button[data-q="' + q + '"]').forEach(function (x) { x.style.borderColor = '#e4d8c6'; }); b.style.borderColor = '#e39b2d'; if (Object.keys(picked).length === 3) { var ok = qs.every(function (item, idx) { return picked[idx] === item.a; }); $('#score', arena).textContent = ok ? 'هر سه درست بود.' : 'یکی را دوباره فکر کن.'; if (ok) mark(2); } }; });
  }
  function r3(wrap) {
    var arena = shell(wrap, { id: 3, title: 'لگوی جادویی', goal: 'یک تصویر خراب بساز که چراغ را روشن کند.', h1: 'تصویری بساز که وجود ندارد.', h2: 'وقتی تصویر خراب شود می‌تواند کار اضافه کند.', h3: '<img src=x onerror="document.querySelector(\'#lamp\').classList.add(\'on\')">', why: 'بعضی تکه‌ها منتظر یک اتفاق‌اند.', word: 'رویداد', wordMean: 'اتفاقی مثل خطا یا کلیک.' });
    arena.innerHTML = '<div class="lamp" id="lamp"></div><input id="inp" type="text" /><div class="row"><button class="primary" id="go">بگذار روی میز</button></div><div class="sink" id="out"></div>';
    watchLamp($('#lamp', arena), 3); $('#go', arena).onclick = function () { $('#out', arena).innerHTML = $('#inp', arena).value; };
  }
  function r4(wrap) {
    var arena = shell(wrap, { id: 4, title: 'آدرس هم حرف می‌زند', goal: 'چیزی در کادر آدرس بگذار که چراغ روشن شود.', h1: 'کادر آدرس هم ورودی است.', h2: 'همان لگوی تصویر خراب اتاق قبل.', h3: '<img src=x onerror="document.querySelector(\'#lamp\').classList.add(\'on\')">', why: 'ته لینک هم ورودی است.', word: 'ورودی', wordMean: 'جایی که حرف تو وارد صفحه می‌شود.' });
    arena.innerHTML = '<div class="lamp" id="lamp"></div><input id="inp" type="text" /><div class="row"><button class="primary" id="go">بگذار ته لینک</button></div><div class="sink" id="out">سلام مهمان</div>';
    watchLamp($('#lamp', arena), 4); $('#go', arena).onclick = function () { $('#out', arena).innerHTML = 'سلام ' + $('#inp', arena).value; };
  }
  function r5(wrap) {
    var arena = shell(wrap, { id: 5, title: 'سانسور ضعیف', goal: 'کلمه script پاک می‌شود. بدون آن چراغ را روشن کن.', h1: 'از پنجره برو.', h2: 'از تصویر خراب استفاده کن.', h3: '<img src=x onerror="document.querySelector(\'#lamp\').classList.add(\'on\')">', why: 'سانسور یک کلمه کافی نیست.', word: 'فیلتر', wordMean: 'دربانی که بعضی کلمه‌ها را حذف می‌کند.' });
    arena.innerHTML = '<div class="lamp" id="lamp"></div><input id="inp" type="text" /><div class="row"><button class="primary" id="go">بفرست</button></div><div class="sink" id="out"></div>';
    watchLamp($('#lamp', arena), 5); $('#go', arena).onclick = function () { $('#out', arena).innerHTML = $('#inp', arena).value.replace(/script/gi, ''); };
  }
  function r6(wrap) {
    var arena = shell(wrap, { id: 6, title: 'جای نشستن', goal: 'لینکی بساز که با کلیک، چراغ روشن شود.', h1: 'حرف تو داخل لینک می‌نشیند.', h2: 'به‌جای آدرس سایت یک دستور کوچک بگذار.', h3: 'javascript:void(document.querySelector(\'#lamp\').classList.add(\'on\'))', why: 'جای نشستن حرف، معنی‌اش را عوض می‌کند.', word: 'زمینه', wordMean: 'جایی که حرف تو می‌نشیند.' });
    arena.innerHTML = '<div class="lamp" id="lamp"></div><input id="inp" type="text" value="https://example.com" /><div class="row"><button class="primary" id="go">لینک را بساز</button></div><div id="out"></div>';
    watchLamp($('#lamp', arena), 6); $('#go', arena).onclick = function () { $('#out', arena).innerHTML = '<a href="' + $('#inp', arena).value + '">روی من کلیک کن</a>'; };
  }
  function r7(wrap) {
    var arena = shell(wrap, { id: 7, title: 'دو اتاق', goal: 'به اتاق بغلی پیامی بفرست که چراغ این‌جا روشن شود.', h1: 'اتاق بغلی هر نامه را روی میز می‌گذارد.', h2: 'نامه را مثل تصویر خراب بفرست.', h3: '<img src=x onerror="parent.postMessage(\'LIT\',\'*\')">', why: 'اگر گیرنده نامه را بدون نگاه روی میز بگذارد، نامه می‌تواند دستور شود.', word: 'پیام', wordMean: 'نامه‌ای از یک صفحه به صفحه دیگر.' });
    arena.innerHTML = '<div class="lamp" id="lamp"></div><iframe class="lab" id="child" src="child.html"></iframe><input id="msg" type="text" /><div class="row"><button class="primary" id="send">بفرست</button></div>';
    window.addEventListener('message', function (e) { if (current !== 7) return; if (e.data === 'LIT') { $('#lamp', arena).classList.add('on'); mark(7); } });
    $('#send', arena).onclick = function () { $('#child', arena).contentWindow.postMessage($('#msg', arena).value, '*'); };
  }
  function r8(wrap) {
    var arena = shell(wrap, { id: 8, title: 'دو داستان', goal: 'برای هر داستان بگو کدام یکی است.', h1: 'یکی کار به‌جای تو است. یکی نخواندن جواب است.', h2: '۱) کار به‌جای تو  ۲) دربان  ۳) همان خانه', h3: '۱ کار به‌جای تو / ۲ دربان جلوی خواندن / ۳ همان خانه مانع نیست', why: 'گاهی لازم نیست جواب را بخوانند؛ کافی است به جای تو کاری انجام شود.', word: 'دربان مرورگر', wordMean: 'قانونی که نمی‌گذارد یک سایت نامه سایت دیگر را بخواند.' });
    var items = [{ t: 'کسی بدون اینکه ببینی از خانه تو برای بانک دکمه بفرست را می‌زند.', o: ['کار به‌جای تو', 'خواندن دفتر تو'], a: 0 }, { t: 'از خانه بغلی می‌خواهند دفتر حساب تو را بخوانند. نامه می‌رود ولی جواب را نشانشان نمی‌دهند.', o: ['دربان جلوی خواندن را گرفت', 'دکمه خراب بود'], a: 0 }, { t: 'داخل همان صفحه خودت هستی و دفتر همان صفحه را می‌خوانی.', o: ['دربان مانع است', 'همان خانه است؛ مانع نیست'], a: 1 }];
    var html = ''; items.forEach(function (it, i) { html += '<div class="story"><b>داستان ' + (i + 1) + '</b><p>' + it.t + '</p>'; it.o.forEach(function (opt, j) { html += '<button data-q="' + i + '" data-i="' + j + '">' + opt + '</button>'; }); html += '</div>'; }); html += '<p id="score"></p>'; arena.innerHTML = html;
    var picked = {}; arena.querySelectorAll('button[data-q]').forEach(function (b) { b.onclick = function () { var q = +b.getAttribute('data-q'); var i = +b.getAttribute('data-i'); picked[q] = i; arena.querySelectorAll('button[data-q="' + q + '"]').forEach(function (x) { x.style.borderColor = '#e4d8c6'; }); b.style.borderColor = '#e39b2d'; if (Object.keys(picked).length === 3) { var ok = items.every(function (it, idx) { return picked[idx] === it.a; }); $('#score', arena).textContent = ok ? 'داستان‌ها را درست جدا کردی.' : 'یکی را دوباره بخوان.'; if (ok) mark(8); } }; });
  }
  $('#reset').onclick = function () { if (confirm('از اتاق اول شروع کنیم؟')) { localStorage.removeItem(KEY); state.done = {}; state.notes = {}; drawHome(); say('از صفر'); } };
  drawHome();
})();
