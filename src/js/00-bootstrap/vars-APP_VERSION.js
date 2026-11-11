"use strict";
/* The release this file is. Raised with every change that is pushed: the last
   number for a fix, the middle one for a feature. CHANGELOG.md says what each
   one brought, and it is shown beside the name top left, so whoever is testing
   can see at a glance that they have the newest file open. */
const APP_VERSION = "1.143.1";
document.getElementById("appVersion").textContent = "v" + APP_VERSION;
/* ============================================================
   00_BOOTSTRAP -- utilities
   Port of: init.lua 00_BOOTSTRAP
   ============================================================ */
const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
const el = (tag, attrs={}, ...kids) => {
  const n = document.createElement(tag);
  for (const [k,v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === "class") n.className = v;
    else if (k === "html") n.innerHTML = v;
    else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
    else if (k === "data") for (const [dk,dv] of Object.entries(v)) n.dataset[dk] = dv;
    else n.setAttribute(k, v);
  }
  for (const kid of kids.flat()) {
    if (kid == null || kid === false) continue;
    n.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
  }
  return n;
};
const esc = s => String(s ?? "").replace(/[&<>"']/g, c =>
  ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const trim = s => String(s ?? "").replace(/^\s+|\s+$/g, "");
/* Text copied from Outlook and Teams can arrive as HTML. Keep the words, not
   the transport markup, when it is shown in a check-in or written to markdown. */
const humanText = value => {
  const box = document.createElement("div");
  box.innerHTML = String(value ?? "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/li>/gi, "\n");
  return trim(box.textContent || "")
    .replace(/\s*\n\s*/g, " · ")
    .replace(/\s+/g, " ");
};
const join = (...p) => p.filter(Boolean).join("/").replace(/\/{2,}/g, "/");
const uid = () => Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);

/* ---------- keeping your place across a redraw ----------
   Any change redraws the whole screen, so whatever had focus -- the state badge
   just clicked, the line being typed in -- went with it, and cycling a state
   meant selecting the todo again before every single step. Name the control just
   before the change that redraws, and focus lands back on the rebuilt one, so
   the next click or keypress carries straight on. */
let REFOCUS = null;
