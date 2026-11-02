function modal({title, hint, body, foot, center = false, side = false, onKey = null, onClose = null}) {
  // Replacing a dialog is not answering it, so the queue stays put.
  closeModal({keepQueue: true});
  const sheet = el("div", {class: "modal"},
    el("header", {}, el("h2", {}, title), el("div", {style: "flex:1"}),
      // Keys to press are no use on a touch screen, so those hints say they are keys.
      hint ? el("span", {class: "hint" + (/\b(esc|enter|letter|ctrl|alt|shift|tab)\b/i.test(hint) ? " keys" : "")}, hint) : null,
      el("button", {class: "iconbtn", onclick: closeModal}, "✕")),
    el("div", {class: "body"}, body),
    foot ? el("div", {class: "foot"}, foot) : null);
  const scrim = el("div", {class: "scrim" + (center ? " center" : "") + (side ? " side" : ""), onclick: e => { if (e.target === scrim) closeModal(); }}, sheet);
  $("#modalRoot").append(scrim);
  resolveAssets(sheet);
  MODAL_KEYS = onKey;
  MODAL_CLOSE = onClose;
  usageNoteDialog(title);
  return {close: closeModal, root: sheet};
}
