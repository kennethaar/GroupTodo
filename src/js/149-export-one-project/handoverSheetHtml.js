/* The handover page: a project for somebody who has never seen GroupToDo. One
   file, nothing to fetch, prints and saves as PDF. It carries its own data so
   the reader can take everything out again as CSV or markdown. */
function handoverSheetHtml(path, opts = {}) {
  const d = handoverData(path, opts);
  const who = s => s ? '<span class="who">' + esc(s) + "</span>" : "";
  const sec = (name, body) => body ? "<h2>" + name + "</h2>\n" + body : "";
  const facts = d.facts.filter(f => f[0] !== "Outcome").map(([k, v]) => "<span><b>" + esc(k) + ":</b> " + esc(v) + "</span>").join("");
  const outcome = (d.facts.find(f => f[0] === "Outcome") || [])[1];
  const stands = d.stands.map(s => '<li><b class="lb">' + s.label + "</b> " + esc(s.text) +
    (s.label === "Late" && s.due ? ' <span class="dim">due ' + esc(s.due) + "</span>" : "") +
    (s.context ? ' <span class="dim">' + esc(s.context) + "</span>" : "") + "</li>").join("");
  const openRows = d.open.map(o => '<li style="margin-left:' + o.depth * 18 + 'px"><span class="box"></span>' + esc(o.text) +
    (o.state === "WAIT" ? ' <span class="dim">waiting</span>' : "") +
    (o.assigned ? ' <span class="dim">assigned: ' + esc(o.assigned) + "</span>" : "") +
    (o.due ? ' <span class="' + (o.late ? "late" : "dim") + '">due ' + esc(o.due) + "</span>" : "") + "</li>").join("");
  const doneRows = d.done.map(o => '<li><span class="box on"></span>' + esc(o.text) +
    (o.date ? ' <span class="dim">' + esc(o.date) + "</span>" : "") + who(o.who) + "</li>").join("");
  const hist = d.history.map(h => '<li><span class="dt">' + esc(h.date) + "</span> " + esc(h.what) + who(h.who) + "</li>").join("");
  const notes = d.notes.map(n => n.head ? "<h3>" + esc(n.text) + "</h3>" :
    '<p style="margin-left:' + n.depth * 18 + 'px">' + esc(n.text) + "</p>").join("") +
    (d.money.length ? '<p class="dim">' + esc(d.money.join("   ")) + "</p>" : "");
  const data = JSON.stringify({title: d.title, open: d.open, done: d.done, history: d.history}).replace(/</g, "\u003c");
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(d.title)}</title>
<style>
:root{--paper:#f7f8f9;--ink:#15202b;--soft:#51606e;--rule:#dde3e8;--late:#b3261e;color-scheme:light}
@media (prefers-color-scheme:dark){:root{--paper:#11161b;--ink:#e8eef3;--soft:#a8b7c4;--rule:#2b353f;--late:#ff8a80;color-scheme:dark}}
body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.55 "Segoe UI",system-ui,sans-serif}
.wrap{max-width:720px;margin:0 auto;padding:28px 18px 60px}
h1{font-size:26px;margin:0 0 6px}h2{font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--soft);border-bottom:1px solid var(--rule);padding-bottom:4px;margin:28px 0 8px}
h3{font-size:15px;margin:14px 0 2px}
.outcome{font-size:18px;margin:0 0 8px}.facts{display:flex;flex-wrap:wrap;gap:4px 18px;color:var(--soft)}
ul{list-style:none;margin:0;padding:0}li{padding:3px 0}p{margin:3px 0}
.dim,.who{color:var(--soft);font-size:14px}.who{float:right;margin-left:12px}.late{color:var(--late);font-size:14px}
.lb{display:inline-block;min-width:68px}.dt{display:inline-block;min-width:92px;color:var(--soft);font-variant-numeric:tabular-nums}
.box{display:inline-block;width:11px;height:11px;border:1.5px solid var(--soft);border-radius:3px;margin-right:8px}.box.on{background:var(--soft)}
.tools{margin-top:34px;color:var(--soft);font-size:14px}button{font:inherit;margin-right:8px;cursor:pointer}
@media print{.tools{display:none}body{background:#fff;color:#000}}
</style></head><body><div class="wrap">
<h1>${esc(d.title)}</h1>
${outcome ? '<p class="outcome">' + esc(outcome) + "</p>" : ""}
<div class="facts">${facts}<span>Handed over ${esc(d.when)}${d.by ? " by " + esc(d.by) : ""}</span></div>
${sec("Where it stands", stands && "<ul>" + stands + "</ul>")}
${sec("Open steps", openRows && "<ul>" + openRows + "</ul>")}
${sec("Done", doneRows && "<ul>" + doneRows + "</ul>")}
${sec("History, oldest first", hist && "<ul>" + hist + "</ul>")}
${sec("Notes", notes)}
<div class="tools">Take the data out: <button onclick="out('csv')">CSV</button><button onclick="out('md')">Markdown</button></div>
</div>
<script id="d" type="application/json">${data}<\/script>
<script>
function out(kind){var D=JSON.parse(document.getElementById("d").textContent),t,n=D.title.replace(/[^\w-]+/g,"-");
var q=function(v){return '"'+String(v||"").replace(/"/g,'""')+'"'};
if(kind==="csv"){t="\ufeffKind,Date,What,Who\r\n"+D.open.map(function(o){return["Open","",o.text+(o.due?" (due "+o.due+")":""),o.assigned].map(q).join(",")})
.concat(D.done.map(function(o){return["Done",o.date,o.text,o.who].map(q).join(",")}),D.history.map(function(o){return["History",o.date,o.what,o.who].map(q).join(",")})).join("\r\n");}
else{t="# "+D.title+"\n\n## Open\n\n"+D.open.map(function(o){return"- [ ] "+o.text}).join("\n")+"\n\n## Done\n\n"+D.done.map(function(o){return"- [x] "+o.text+" "+o.date}).join("\n")+"\n\n## History\n\n"+D.history.map(function(o){return"- "+o.date+" "+o.what+(o.who?" ("+o.who+")":"")}).join("\n")+"\n";}
var a=document.createElement("a");a.href=URL.createObjectURL(new Blob([t],{type:kind==="csv"?"text/csv":"text/markdown"}));a.download=n+"."+kind;a.click();}
<\/script>
</body></html>
`;
}
