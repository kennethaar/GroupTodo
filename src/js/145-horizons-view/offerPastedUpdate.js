/* After a paste anywhere (#373 reopened): if it is an update on your tasks,
   a toast names each task and what would change. The paste stays as text.
   Apply updates them; Keep as text closes the toast and changes nothing. */
function offerPastedUpdate(raw) {
  const u = pastedUpdate(raw);
  if (!u) return false;
  const day = iso => new Date(iso + "T12:00:00").toLocaleDateString([], {weekday: "short", day: "numeric", month: "short"});
  const what = r => [r.done ? "Done" : "", r.due ? "Due " + day(r.due) : "", r.note ? "note added" : "", r.ack ? "Got it" : ""]
    .filter(Boolean).join(" · ");
  const name = r => "“" + inSpace(r.hit.space, () => plainTitle(r.hit.block.title)) + "”";
  const text = u.rows.length === 1
    ? "Update on " + name(u.rows[0]) + " (" + u.who + "): " + what(u.rows[0])
    : "Update from " + u.who + ": " + u.rows.map(r => name(r) + ": " + what(r)).join("; ");
  document.querySelectorAll("#toasts .toast.pupdate").forEach(n => n.remove());
  const t = el("div", {class: "toast pupdate", role: "status"},
    el("span", {}, text),
    el("button", {class: "act", type: "button", onclick: () => { t.remove(); applyPastedUpdate(u); }}, "Apply"),
    el("button", {class: "act", type: "button", onclick: () => t.remove()}, "Keep as text"));
  $("#toasts").append(t);
  setTimeout(() => t.remove(), 20000);
  return true;
}
