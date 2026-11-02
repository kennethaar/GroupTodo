function notify(msg, level="info", action=null) {
  if (NOTIFY_MUTE && level === "info" && !action) return;
  const t = el("div", {class:"toast " + (level==="warn"?"warn":level==="error"?"err":"")},
    el("span", {}, msg),
    action ? el("button", {class:"act", onclick:e=>{
      e.target.closest(".toast").remove(); action.run();
    }}, action.label) : null,
    el("button", {class:"x", onclick:e=>e.target.closest(".toast").remove()}, "✕"));
  $("#toasts").append(t);
  // An offer to undo has to outlast the moment you realise you need it.
  setTimeout(() => t.remove(), action ? 12000 : level === "info" ? 3800 : 9000);
}
