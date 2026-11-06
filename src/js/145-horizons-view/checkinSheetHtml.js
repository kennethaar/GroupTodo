/* One HTML file, no network, no libraries, no fonts to fetch: it has to open
   on a laptop in a meeting room with the wifi down, four years from now. */
function checkinSheetHtml({to, from, items, replyTo}) {
  items = (items || []).map(it => Object.assign({}, it, {t: humanText(it.t)}));
  const W = ASK_SHEET[askLang()] || ASK_SHEET.en, L = ASK_NOTE[askLang()];
  const data = jsonForScript({
    v: 1, to, from, replyTo: replyTo || "",
    at: nowStamp(),
    // The words the page shows, and the labels its reply goes back with.
    w: W, lab: {comment: L.comment, answer: L.answer, reference: L.reference},
    items: items.map(it => {
      // A line you reworded in the note reads the same here.
      const parts = it.edit ? {subject: it.edit.s, ask: it.edit.t}
        : it.q ? askQuestionParts(it, to) : {subject: "", ask: checkinTaskTitle(it.title, to)};
      return {
      k: it.key, t: parts.ask || parts.subject, s: parts.ask ? parts.subject : "",
      asked: it.days ? askFill(W.open, {days: it.days}) : "", q: it.q ? 1 : 0,
      c: ((it.edit ? it.edit.c : it.context) || []).map(c => ({d: c.depth, t: c.text})),
      };
    }),
  });
  const title = askFill(W.title, {from});
  const k = askKinds(items);
  const many = (n, pair) => n + " " + pair[n === 1 ? 0 : 1];
  // The words are escaped first, then the names and counts go in bold.
  const lede = askFill(esc(W[!k.q ? "ledeW" : !k.w ? "ledeQ" : "ledeB"]), {
    from: "<b>" + esc(from) + "</b>", first: esc(firstNameOf(from)),
    things: "<b>" + esc(many(k.w, W.thing)) + "</b>", questions: "<b>" + esc(many(k.q, W.question)) + "</b>"});
  return `<!doctype html>
<html lang="${W.lang}"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<style>
:root{--paper:#f7f8f9;--card:#fff;--sunk:#eef1f4;--ink:#15202b;--soft:#51606e;
  --faint:#8696a4;--rule:#dde3e8;--accent:#1f6fd0;--accent-soft:#e8f1fc;
  --good:#1a7f4f;--good-soft:#e4f4ec;color-scheme:light;
  --body:"Segoe UI",system-ui,-apple-system,Roboto,Helvetica,Arial,sans-serif;
  --mono:"Cascadia Mono",Consolas,ui-monospace,monospace}
@media (prefers-color-scheme:dark){:root{--paper:#11161b;--card:#1a2128;--sunk:#141a20;
  --ink:#e8eef3;--soft:#a8b7c4;--faint:#76858f;--rule:#2b353f;--accent:#76b2f5;
  --accent-soft:#16293d;--good:#5cc08c;--good-soft:#142a1f;color-scheme:dark}}
*{box-sizing:border-box}
body{margin:0;background:var(--paper);color:var(--ink);font-family:var(--body);
  font-size:16px;line-height:1.55}
.wrap{max-width:640px;margin:0 auto;padding:28px 18px 60px}
h1{font-size:25px;margin:0 0 8px;line-height:1.2}
.lede{color:var(--soft);margin:0 0 22px}
.lede b{color:var(--ink)}
.card{background:var(--card);border:1px solid var(--rule);border-radius:12px;overflow:hidden}
.row{border-bottom:1px solid var(--rule)}
.row:last-child{border-bottom:0}
.hit{display:grid;grid-template-columns:26px 1fr;gap:12px;align-items:start;width:100%;
  text-align:left;background:none;border:0;padding:15px 16px;cursor:pointer;color:inherit;
  font:inherit;font-size:16px}
.hit:hover{background:var(--accent-soft)}
.hit.ask{grid-template-columns:1fr;cursor:default}
.hit.ask:hover{background:none}
.row.ask .note{padding-left:16px}
.hit:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}
.box{width:23px;height:23px;border-radius:6px;border:1.7px solid var(--faint);display:grid;
  place-items:center;font-size:14px;color:transparent;margin-top:1px}
.box svg{width:13px;height:13px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.row.done .box{background:var(--good);border-color:var(--good);color:#fff}
.t{min-width:0}
.row.done .t>span:first-child{text-decoration:line-through;color:var(--faint)}
.meta{display:block;color:var(--faint);font-size:12.5px;font-family:var(--mono);margin-top:3px}
.note{padding:0 16px 15px 54px}
.notebtn{background:none;border:0;padding:0;font:inherit;font-size:13.5px;color:var(--accent);
  cursor:pointer;text-decoration:underline;text-underline-offset:2px}
textarea{width:100%;margin-top:4px;font:inherit;font-size:15px;padding:9px 10px;
  border:1px solid var(--rule);border-radius:8px;background:var(--paper);color:var(--ink);
  resize:vertical;min-height:58px}
.foot{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:20px}
button.b{font:inherit;font-size:16px;font-weight:600;padding:12px 20px;border-radius:9px;
  border:1px solid var(--rule);background:var(--card);color:var(--ink);cursor:pointer}
button.b.go{background:var(--accent);border-color:var(--accent);color:#fff}
button.b:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.count{margin-left:auto;color:var(--faint);font-size:13.5px;font-family:var(--mono)}
.said{margin-top:16px;padding:13px 15px;border-radius:9px;background:var(--good-soft);
  color:var(--good);border:1px solid currentColor;font-size:15px}
.said a{color:inherit;font-weight:600}
.said b{font-weight:700}
.how{margin:10px 0 0;color:var(--soft);font-size:14px}
.how b{color:var(--ink)}
.fall{margin-top:14px}
.fall textarea{font-family:var(--mono);font-size:12.5px;min-height:150px}
.tail{color:var(--faint);font-size:13px;margin-top:30px;border-top:1px solid var(--rule);
  padding-top:14px}
.ctx{display:block;color:var(--soft);font-size:14px;margin-top:4px;padding-left:10px;
  border-left:2px solid var(--rule)}
.row.done .t>span.ctx{text-decoration:none}
.subj{padding:13px 16px 0;font-size:13.5px;font-weight:600;color:var(--soft)}
.subj+.row .hit,.row.more .hit{padding-top:8px}
.sec{padding:9px 16px;font-size:12px;letter-spacing:.05em;text-transform:uppercase;
  color:var(--soft);background:var(--sunk);border-bottom:1px solid var(--rule)}
@media (max-width:420px){.note{padding-left:16px}}
</style></head><body>
<div class="wrap">
<h1>${esc(askFill(W.hello, {first: firstNameOf(to)}))}</h1>
<p class="lede">${lede}</p>
<div class="card" id="rows"></div>
<div class="foot">
  <button class="b go" id="send">${esc(askFill(W.send, {first: firstNameOf(from)}))}</button>
  <button class="b" id="copy">${esc(W.copy)}</button>
  <span class="count" id="count"></span>
</div>
<p class="how" id="how"></p>
<div id="said"></div>
<p class="tail">${esc(askFill(W.tail, {lines: W.line[items.length === 1 ? 0 : 1]}))}</p>
</div>
<script type="application/json" id="gtd-data">${data}<\/script>
<script>
(function(){
var D = JSON.parse(document.getElementById("gtd-data").textContent);
var S = {};
var KEY = "gtd-checkin:" + D.at;
try { S = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch(e) { S = {}; }
function keep(){ try { localStorage.setItem(KEY, JSON.stringify(S)); } catch(e){} }
function st(k){ return S[k] || (S[k] = {done:false, note:"", open:false}); }
// The page's words, in the language of the note it came with.
function T(k, v){ return String(D.w[k]).replace(/\\{(\\w+)\\}/g, function(m, x){ return v && x in v ? v[x] : m; }); }
var FIRST = D.from.split(" ")[0];

var rows = document.getElementById("rows");
var countEl = document.getElementById("count");

var MIXED = D.items.some(function(it){ return it.q; }) && D.items.some(function(it){ return !it.q; });
function count(){
  var n = 0;
  // A question is answered when there is an answer; it has no box to tick.
  D.items.forEach(function(it){ var s = st(it.k); if (it.q ? trim(s.note) : s.done) n++; });
  countEl.textContent = T(MIXED ? "countB" : D.items[0] && D.items[0].q ? "countQ" : "countW", {n: n, all: D.items.length});
  updateSendLabel();
}
function trim(s){ return String(s || "").replace(/^\\s+|\\s+$/g, ""); }
function draw(){
  rows.textContent = "";
  var last = null, about = null;
  D.items.forEach(function(it){
    var s = st(it.k);
    if (MIXED && !!it.q !== last) {
      last = !!it.q; about = null;
      var sec = document.createElement("div");
      sec.className = "sec"; sec.textContent = it.q ? D.w.secQ : D.w.secW;
      rows.appendChild(sec);
    }
    // Questions about the same thing sit under it, named once.
    if (it.s && it.s !== about) {
      var subj = document.createElement("div");
      subj.className = "subj"; subj.textContent = it.s;
      rows.appendChild(subj);
    }
    var more = !!it.s && it.s === about && rows.lastChild;
    if (more) rows.lastChild.style.borderBottom = "0";
    about = it.s || null;
    var row = document.createElement("div");
    row.className = "row" + (s.done && !it.q ? " done" : "") + (more ? " more" : "") + (it.q ? " ask" : "");

    // A question is not ticked: the answer under it is what answers it.
    var hit = document.createElement(it.q ? "div" : "button");
    if (it.q) hit.className = "hit ask";
    else { hit.type = "button"; hit.className = "hit"; hit.setAttribute("aria-pressed", String(!!s.done)); }
    var box = document.createElement("span");
    box.className = "box"; box.setAttribute("aria-hidden", "true");
    var boxSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    boxSvg.setAttribute("viewBox", "0 0 24 24");
    boxSvg.innerHTML = '<path d="M4 12l6 6L20 6"/>';
    box.appendChild(boxSvg);
    var t = document.createElement("span"); t.className = "t";
    var name = document.createElement("span"); name.textContent = it.t;
    t.appendChild(name);
    if (it.asked) { var m = document.createElement("span"); m.className = "meta"; m.textContent = it.asked; t.appendChild(m); }
    (it.c || []).forEach(function(c){
      var cx = document.createElement("span"); cx.className = "ctx";
      cx.style.marginLeft = (c.d * 16) + "px"; cx.textContent = c.t; t.appendChild(cx);
    });
    if (!it.q) hit.appendChild(box);
    hit.appendChild(t);
    if (!it.q) hit.addEventListener("click", function(){ s.done = !s.done; keep(); draw(); count(); });
    row.appendChild(hit);

    var nd = document.createElement("div"); nd.className = "note";
    if (it.q || s.open || s.note) {
      var ta = document.createElement("textarea");
      ta.value = s.note || "";
      ta.placeholder = it.q ? D.w.phAnswer : T("phNote", {first: FIRST});
      ta.setAttribute("aria-label", (it.q ? D.w.ariaAnswer : D.w.ariaNote) + (it.s ? it.s + ": " : "") + it.t);
      ta.addEventListener("input", function () {
        s.note = ta.value;
        keep();
        if (it.q) count(); else updateSendLabel();
      });
      nd.appendChild(ta);
    } else {
      var b = document.createElement("button");
      b.type = "button"; b.className = "notebtn"; b.textContent = it.q ? D.w.btnAnswer : D.w.btnNote;
      b.addEventListener("click", function(){ s.open = true; keep(); draw(); });
      nd.appendChild(b);
    }
    row.appendChild(nd);
    rows.appendChild(row);
  });
}
function when(iso){
  var d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  function p(n){ return (n < 10 ? "0" : "") + n; }
  return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()) + " " + p(d.getHours()) + ":" + p(d.getMinutes());
}
function reply(){
  var out = ["---"];
  D.items.forEach(function(it){
    var s = st(it.k);
    out.push((it.q ? "- " : "- [" + (s.done ? "x" : " ") + "] ") + (it.s ? it.s + ": " : "") + it.t);
    var note = (s.note || "").replace(/\\s+$/, "");
    // The labels of the note's language, which the importer reads in all of them.
    var label = "  " + (it.q ? D.lab.answer : D.lab.comment) + " ";
    if (note) note.split(/\\r?\\n/).forEach(function(l){ out.push(label + l); });
    if (note) out.push("");
    var ref = String(it.k || "").split("\\u0001");
    if (ref.length === 3) out.push("  " + D.lab.reference + " " + ref[0] + "-" + ref[2]);
    out.push("");
  });
  if (out[out.length - 1] === "") out.pop();
  out.push("---");
  return out.join("\\n");
}
function replyMail(text){
  return "mailto:" + encodeURIComponent(D.replyTo || "") + "?subject=" + encodeURIComponent(T("title", {from: D.from})) + "&body=" + encodeURIComponent(text);
}
function updateSendLabel(){
  var short = D.replyTo && replyMail(reply()).length <= 2000;
  document.getElementById("send").textContent = short ? T("send", {first: FIRST}) : D.w.save;
  // What the button does, and the step after it that is still theirs.
  var how = document.getElementById("how"), b = document.createElement("b");
  how.textContent = "";
  how.appendChild(document.createTextNode(short ? T("howMail", {from: D.from}) : D.w.howFile));
  b.textContent = short ? D.w.howMailB
    : T("howFileB", {from: D.from, addr: D.replyTo ? " (" + D.replyTo + ")" : ""});
  how.appendChild(b);
}
function fileName(){
  return "grouptodo-update-" + D.to.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") +
    "_" + when(new Date().toISOString()).split(" ")[0] + ".md";
}
function say(node){
  var box = document.getElementById("said");
  box.textContent = "";
  box.appendChild(node);
}
document.getElementById("send").addEventListener("click", function(){
  var text = reply(), name = fileName();
  var mail = replyMail(text);
  if (D.replyTo && mail.length <= 2000) {
    window.location.href = mail;
    // The one step left is theirs, so it is the thing this says loudest.
    var message = document.createElement("p");
    message.className = "said";
    var must = document.createElement("b");
    must.textContent = T("sentB", {from: D.from, first: FIRST});
    message.appendChild(must);
    message.appendChild(document.createTextNode(T("sentRest", {addr: D.replyTo})));
    say(message);
    return;
  }
  var saved = false;
  try {
    var url = URL.createObjectURL(new Blob([text], {type: "text/markdown"}));
    var a = document.createElement("a");
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function(){ URL.revokeObjectURL(url); }, 10000);
    saved = true;
  } catch(e) {}
  var p = document.createElement("p");
  p.className = "said";
  if (saved) {
    p.appendChild(document.createTextNode(T("saved", {file: name, from: D.from})));
    if (D.replyTo) {
      var a2 = document.createElement("a");
      a2.href = "mailto:" + D.replyTo + "?subject=" + encodeURIComponent(T("title", {from: D.from}))
        + "&body=" + encodeURIComponent(D.w.fileMail + "\\n\\n" + text);
      a2.textContent = T("openMail", {addr: D.replyTo});
      p.appendChild(a2);
      p.appendChild(document.createTextNode(D.w.attachOr));
    }
    say(p);
  } else {
    p.textContent = D.w.noSave;
    say(p);
    showText(text);
  }
});
document.getElementById("copy").addEventListener("click", function(){
  var text = reply(), btn = this;
  var ok = function(){ btn.textContent = D.w.copied; setTimeout(function(){ btn.textContent = D.w.copy; }, 1800); };
  if (navigator.clipboard && navigator.clipboard.writeText)
    navigator.clipboard.writeText(text).then(ok, function(){ showText(text); });
  else showText(text);
});
function showText(text){
  var box = document.getElementById("said");
  var d = document.createElement("div"); d.className = "fall";
  var ta = document.createElement("textarea");
  ta.readOnly = true; ta.value = text;
  ta.setAttribute("aria-label", D.w.ariaCopy);
  d.appendChild(ta);
  box.appendChild(d);
  ta.focus(); ta.select();
}
draw(); count();
})();
<\/script>
</body></html>
`;
}
