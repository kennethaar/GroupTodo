/* ---------- the pieces of a topic ---------- */
/* The picture of a screen is a file beside the app, in docs/help/. The page
   loads nothing from anywhere else, so with the app on its own the topic is
   words only. */
function helpShot(id) {
  if (!HELP[id] || !HELP[id].shot) return null;
  return el("img", {class: "helpshot", src: "docs/help/" + id + ".jpg", alt: HELP[id].title, loading: "lazy",
    onerror: e => e.target.remove()});
}
