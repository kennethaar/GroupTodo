function nudgeToast({title, hint, body, foot, onClose}) {
  const t = el("div", {class: "toast reminder", role: "status"},
    el("strong", {}, title), hint ? el("p", {}, hint) : null, body);
  const acts = el("div", {class: "acts"});
  for (const b of (foot || []).flat().filter(Boolean)) {
    if (!(b instanceof Node) || NUDGE_DISMISS_RE.test(b.textContent.trim())) continue;
    b.addEventListener("click", () => t.remove(), {once: true});
    acts.append(b);
  }
  t.append(acts);
  $("#toasts").append(t);
  setTimeout(() => { t.remove(); if (onClose) onClose(); }, 15000);
}
