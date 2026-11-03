function nudgeToast({title, hint, body, foot, onClose, stay = false, kind = ""}) {
  const t = el("div", {class: "toast reminder" + (kind ? " " + kind : ""), role: "status"},
    stay ? el("button", {class: "x", title: "Close", "aria-label": "Close",
      onclick: () => { t.remove(); if (onClose) onClose(); }}, "✕") : null,
    el("strong", {}, title), hint ? el("p", {}, hint) : null, body);
  const acts = el("div", {class: "acts"});
  for (const b of (foot || []).flat().filter(Boolean)) {
    if (!(b instanceof Node) || NUDGE_DISMISS_RE.test(b.textContent.trim())) continue;
    b.addEventListener("click", () => t.remove(), {once: true});
    acts.append(b);
  }
  t.append(acts);
  $("#toasts").append(t);
  if (!stay) setTimeout(() => { t.remove(); if (onClose) onClose(); }, 15000);
}
