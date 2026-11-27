// Serve an HTML mockup with a comment layer, so the user can comment on any
// part of it and Claude can read the comments without copy and paste.
//
//   node docs/ux/mockup-serve.mjs <mockup.html> [port]
//
// Open http://localhost:<port>/ (default 8787). Press "Comment", click a part
// of the page, write. Each comment is saved at once to
// <mockup>.comments.json next to the mockup. "Copy all" copies them as text
// for pasting into the chat instead. No dependencies.
import {createServer} from "node:http";
import {readFileSync, writeFileSync, existsSync} from "node:fs";
import {resolve} from "node:path";

const file = resolve(process.argv[2] || "");
if (!process.argv[2] || !existsSync(file)) { console.error("usage: node docs/ux/mockup-serve.mjs <mockup.html> [port]"); process.exit(1); }
const port = +(process.argv[3] || 8787);
const store = file.replace(/\.html?$/i, "") + ".comments.json";
const read = () => existsSync(store) ? readFileSync(store, "utf8") : "[]";

const layer = String.raw`
(() => {
  const css = document.createElement("style");
  css.textContent = ".cmt-bar{position:fixed;right:16px;bottom:16px;z-index:99999;display:flex;gap:8px;font:14px system-ui}" +
    ".cmt-bar button{background:#ffd54a;color:#222;border:0;border-radius:99px;padding:8px 14px;font:inherit;font-weight:600;cursor:pointer;box-shadow:0 4px 14px #0006}" +
    ".cmt-on *{cursor:crosshair!important}.cmt-hover{outline:2px dashed #ffd54a!important;outline-offset:2px}" +
    ".cmt-pin{position:absolute;z-index:99998;background:#ffd54a;color:#222;border-radius:50%;width:22px;height:22px;font:700 12px/22px system-ui;text-align:center;cursor:pointer;box-shadow:0 2px 6px #0008}" +
    ".cmt-panel{position:fixed;right:16px;bottom:64px;z-index:99999;width:340px;max-height:60vh;overflow:auto;background:#fffbe6;color:#222;border-radius:10px;padding:12px;font:13px/1.4 system-ui;box-shadow:0 8px 30px #0008}" +
    ".cmt-panel textarea{width:100%;min-height:70px;font:inherit;box-sizing:border-box}.cmt-panel .it{border-top:1px solid #e5d9a8;padding:6px 0}" +
    ".cmt-panel .on{color:#776;font-size:12px}.cmt-panel button{font:inherit;cursor:pointer}";
  document.head.append(css);
  let list = [], on = false, panel = null;
  const where = n => {
    const sec = n.closest("section[id]"); const tab = sec ? sec.id : "";
    const txt = (n.innerText || n.value || n.alt || n.tagName).trim().replace(/\s+/g, " ").slice(0, 80);
    return {tab, on: txt};
  };
  const save = () => fetch("/__comments", {method: "POST", body: JSON.stringify(list)}).then(r => status(r.ok ? "Saved for Claude" : "Not saved")).catch(() => status("Not saved: copy them instead"));
  const status = t => { st.textContent = t; };
  const pins = () => {
    document.querySelectorAll(".cmt-pin").forEach(p => p.remove());
    list.forEach((c, i) => {
      if (c.tab && document.getElementById(c.tab)?.hidden) return;
      const p = document.createElement("div"); p.className = "cmt-pin"; p.textContent = i + 1; p.title = c.text;
      p.style.left = c.x + "px"; p.style.top = c.y + "px"; p.onclick = e => { e.stopPropagation(); show(); };
      document.body.append(p);
    });
  };
  const show = (draft) => {
    panel?.remove(); panel = document.createElement("div"); panel.className = "cmt-panel";
    if (draft) {
      panel.innerHTML = "<b>Comment on:</b> <span class=on></span><textarea placeholder='What should change?'></textarea><button class=ok>Save</button> <button class=no>Cancel</button>";
      panel.querySelector(".on").textContent = "“" + draft.on + "”";
      const ta = panel.querySelector("textarea"); setTimeout(() => ta.focus(), 20);
      panel.querySelector(".ok").onclick = () => { if (ta.value.trim()) { list.push({...draft, text: ta.value.trim(), at: new Date().toISOString()}); save(); } panel.remove(); panel = null; pins(); };
      panel.querySelector(".no").onclick = () => { panel.remove(); panel = null; };
    } else {
      panel.innerHTML = "<b>Comments</b> <button class=x style='float:right'>✕</button>";
      list.forEach((c, i) => { const d = document.createElement("div"); d.className = "it";
        d.innerHTML = "<b></b> <span class=on></span><div class=t></div><button class=del>Delete</button>";
        d.querySelector("b").textContent = (i + 1) + "."; d.querySelector(".on").textContent = (c.tab ? "[" + c.tab + "] " : "") + "“" + c.on + "”";
        d.querySelector(".t").textContent = c.text;
        d.querySelector(".del").onclick = () => { list.splice(i, 1); save(); pins(); show(); };
        panel.append(d); });
      if (!list.length) panel.append("None yet. Press Comment, then click a part of the page.");
      panel.querySelector(".x").onclick = () => { panel.remove(); panel = null; };
    }
    document.body.append(panel);
  };
  const bar = document.createElement("div"); bar.className = "cmt-bar";
  const st = document.createElement("span"); st.style.cssText = "align-self:center;color:#ffd54a;text-shadow:0 1px 2px #000";
  const b1 = document.createElement("button"), b2 = document.createElement("button"), b3 = document.createElement("button");
  b1.textContent = "💬 Comment"; b2.textContent = "List"; b3.textContent = "Copy all";
  b1.onclick = e => { e.stopPropagation(); on = !on; document.body.classList.toggle("cmt-on", on); b1.textContent = on ? "Click a part… (Esc)" : "💬 Comment"; };
  b2.onclick = e => { e.stopPropagation(); show(); };
  b3.onclick = e => { e.stopPropagation(); navigator.clipboard.writeText(list.map((c, i) => (i + 1) + ". [" + c.tab + "] “" + c.on + "”\n   " + c.text).join("\n")); status("Copied"); };
  bar.append(st, b1, b2, b3); document.body.append(bar);
  let last = null;
  document.addEventListener("mouseover", e => { if (!on || bar.contains(e.target)) return; last?.classList.remove("cmt-hover"); last = e.target; last.classList.add("cmt-hover"); }, true);
  document.addEventListener("click", e => {
    if (!on || bar.contains(e.target) || panel?.contains(e.target)) return;
    e.preventDefault(); e.stopPropagation(); last?.classList.remove("cmt-hover");
    on = false; document.body.classList.remove("cmt-on"); b1.textContent = "💬 Comment";
    show({...where(e.target), x: e.pageX + 6, y: e.pageY - 10});
  }, true);
  document.addEventListener("keydown", e => { if (e.key === "Escape" && on) b1.click(); });
  document.addEventListener("click", () => setTimeout(pins, 50));
  fetch("/__comments").then(r => r.json()).then(j => { list = j; pins(); status(list.length ? list.length + " saved" : ""); });
})();`;

createServer((req, res) => {
  if (req.url === "/__comments" && req.method === "POST") {
    let body = ""; req.on("data", d => body += d);
    req.on("end", () => { try { JSON.parse(body); writeFileSync(store, body); res.end("ok"); } catch { res.statusCode = 400; res.end("bad"); } });
    return;
  }
  if (req.url === "/__comments") { res.setHeader("content-type", "application/json"); res.end(read()); return; }
  if (req.url === "/__comments.js") { res.setHeader("content-type", "text/javascript"); res.end(layer); return; }
  const html = readFileSync(file, "utf8").replace(/<\/body>/i, '<script src="/__comments.js"></script></body>');
  res.setHeader("content-type", "text/html; charset=utf-8"); res.end(html);
}).listen(port, "127.0.0.1", () => console.log("Mockup at http://localhost:" + port + "/  comments -> " + store));
