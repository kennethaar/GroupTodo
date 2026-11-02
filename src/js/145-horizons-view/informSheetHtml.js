/* The sheet: read, not filled in. One file, nothing to fetch, the same look
   as the check-in sheet, so it opens anywhere and still reads in four years. */
function informSheetHtml({to, from, items, named}) {
  const t = informWords();
  const pill = v => '<span class="st ' + esc(String(v.core || "").toLowerCase()) + '">' + esc(informWordOf(v, t)) + "</span>";
  let about = "";
  const rows = items.map(it => {
    const h = informHeadOf(it, named);
    const head = h && h !== about ? '<div class="sec">' + esc(informHeadText(h, t)) + "</div>" : "";
    about = h;
    return head + '<div class="row">' +
      '<div class="top"><span class="t">' + esc(it.t) + "</span>" + (it.status ? pill(it) : "") + "</div>" +
      (trim(it.comment || "") ? '<p class="c">' + esc(trim(it.comment)).replace(/\n/g, "<br>") + "</p>" : "") +
      (it.context || []).map(c => '<span class="ctx" style="margin-left:' + (c.depth * 16) + 'px">' + esc(informLineText(c, t)) + "</span>").join("") +
      "</div>";
  }).join("\n");
  const when = formatStamp(nowStamp());
  return `<!doctype html>
<html lang="${esc(askLang())}"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(askFill(t.title, {from}))}</title>
<style>
:root{--paper:#f7f8f9;--card:#fff;--sunk:#eef1f4;--ink:#15202b;--soft:#51606e;
  --faint:#8696a4;--rule:#dde3e8;--accent:#1f6fd0;--accent-soft:#e8f1fc;
  --good:#1a7f4f;--good-soft:#e4f4ec;--wait:#9a6400;--wait-soft:#fbf1dc;color-scheme:light;
  --body:"Segoe UI",system-ui,-apple-system,Roboto,Helvetica,Arial,sans-serif;
  --mono:"Cascadia Mono",Consolas,ui-monospace,monospace}
@media (prefers-color-scheme:dark){:root{--paper:#11161b;--card:#1a2128;--sunk:#141a20;
  --ink:#e8eef3;--soft:#a8b7c4;--faint:#76858f;--rule:#2b353f;--accent:#76b2f5;
  --accent-soft:#16293d;--good:#5cc08c;--good-soft:#142a1f;--wait:#e0b061;--wait-soft:#2e2414;color-scheme:dark}}
*{box-sizing:border-box}
body{margin:0;background:var(--paper);color:var(--ink);font-family:var(--body);font-size:16px;line-height:1.55}
.wrap{max-width:640px;margin:0 auto;padding:28px 18px 60px}
h1{font-size:25px;margin:0 0 8px;line-height:1.2}
.lede{color:var(--soft);margin:0 0 4px}
.lede b{color:var(--ink)}
.at{color:var(--faint);font-size:12.5px;font-family:var(--mono);margin:0 0 22px}
.card{background:var(--card);border:1px solid var(--rule);border-radius:12px;overflow:hidden}
.row{border-bottom:1px solid var(--rule);padding:15px 16px}
.row:last-child{border-bottom:0}
.top{display:flex;gap:12px;align-items:flex-start;justify-content:space-between}
.t{min-width:0;font-weight:600}
.st{flex:0 0 auto;font-size:12.5px;padding:2px 10px;border-radius:999px;background:var(--accent-soft);color:var(--accent);white-space:nowrap}
.st.done{background:var(--good-soft);color:var(--good)}
.st.wait{background:var(--wait-soft);color:var(--wait)}
.st.todo,.st.cancelled{background:var(--sunk);color:var(--soft)}
.c{margin:6px 0 0}
.ctx{display:block;color:var(--soft);font-size:14px;margin-top:4px;padding-left:10px;border-left:2px solid var(--rule)}
.sec{padding:9px 16px;font-size:12px;letter-spacing:.05em;text-transform:uppercase;color:var(--soft);background:var(--sunk);border-bottom:1px solid var(--rule)}
.tail{color:var(--faint);font-size:13px;margin-top:30px;border-top:1px solid var(--rule);padding-top:14px}
</style></head><body>
<div class="wrap">
<h1>${esc(askFill(t.hello, {first: firstNameOf(to)}))}</h1>
<p class="lede">${askFill(esc(t.lede), {from: "<b>" + esc(from) + "</b>"})}</p>
<p class="at">${esc(askFill(t.at, {when}))}</p>
<div class="card">
${rows}
</div>
<p class="tail">${esc(askFill(t.tail, {from}))}</p>
</div>
</body></html>
`;
}
