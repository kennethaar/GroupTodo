/* A picture clicked in a line opens full size over the app, with a close
   button and Esc, so you stay where you were (#320). It used to open a new
   tab without a word, and the way back was the browser's own tab bar. The new
   tab is still one labelled click away, for zooming or saving. */
function openPicture(src, alt) {
  const body = el("div", {class: "pictureview-wrap"},
    el("img", {class: "pictureview", src, alt: alt || "", onclick: closeModal}));
  const foot = el("a", {class: "btn", href: src, target: "_blank", rel: "noopener", onclick: () => closeModal()},
    "Open in new tab ↗");
  return modal({center: true, title: alt || "Picture", hint: "Esc closes", body, foot});
}
