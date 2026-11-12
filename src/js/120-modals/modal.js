/* sub: a line under the title, such as who a message goes to. tools: a
   control the whole dialog answers to, such as its language, by the ✕ (#372). */
function modal({title, hint, body, foot, center = false, side = false, onKey = null, onClose = null, sub = null, tools = null}) {
  // Replacing a dialog is not answering it, so the queue stays put.
  closeModal({keepQueue: true});
  const sheet = el("div", {class: "modal"},
    el("header", {}, sub ? el("div", {class: "mtitle"}, el("h2", {}, title), el("div", {class: "msub"}, sub)) : el("h2", {}, title),
      el("div", {style: "flex:1"}),
      // Keys to press are no use on a touch screen, so those hints say they are keys.
      hint ? el("span", {class: "hint" + (/\b(esc|enter|letter|ctrl|alt|shift|tab)\b/i.test(hint) ? " keys" : "")}, hint) : null,
      tools,
      el("button", {class: "iconbtn", onclick: closeModal}, "✕")),
    el("div", {class: "body"}, body),
    foot ? el("div", {class: "foot"}, foot) : null);
  // Only a press that starts and ends on the backdrop closes the dialog, so a
  // text selection dragged past the edge keeps what was typed (#358).
  let downOnScrim = false;
  const scrim = el("div", {class: "scrim" + (center ? " center" : "") + (side ? " side" : ""),
    onpointerdown: e => { downOnScrim = e.target === scrim; },
    onclick: e => { if (e.target === scrim && downOnScrim) closeModal(); downOnScrim = false; }}, sheet);
  $("#modalRoot").append(scrim);
  resolveAssets(sheet);
  MODAL_KEYS = onKey;
  MODAL_CLOSE = onClose;
  usageNoteDialog(title);
  return {close: closeModal, root: sheet};
}
