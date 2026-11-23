/* A picture clicked in a line opens full size over the app, with a close
   button and Esc, so you stay where you were (#320). It used to open a new
   tab without a word, and the way back was the browser's own tab bar. The new
   tab is still one labelled click away, for zooming or saving. Opened from
   a line ({path, block, mark}: the ![](…) source as written), it can go on
   the slide instead, in the line's notepad (#476). */
function openPicture(src, alt, from = null) {
  const body = el("div", {class: "pictureview-wrap"},
    el("img", {class: "pictureview", src, alt: alt || "", onclick: closeModal}));
  const tab = el("a", {class: "btn", href: src, target: "_blank", rel: "noopener", onclick: () => closeModal()},
    "Open in new tab ↗");
  const slide = from && slidePicture("![](" + from.mark + ")") && (from.block.title || "").includes("](" + from.mark + ")")
    ? el("button", {class: "btn", onclick: () => { closeModal(); slidePicMove(from.path, from.block, from.mark); }}, "Use on the slide")
    : null;
  return modal({center: true, title: alt || "Picture", hint: "Esc closes", body, foot: slide ? [slide, tab] : tab});
}
