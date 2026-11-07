/* "Mind gone blank?": one prompt at a time, for Brainstorm and for Rules we play by.
   One Hide prompts for both: not wanting prompts is a matter of taste, not of the question. */
function npmDeck(prompts, key, ...extra) {
  const show = on => () => { NPM.hideDeck = !on; npmSave(); render(); };
  if (NPM.hideDeck) return el("button", {class: "textbtn", onclick: show(true)}, "Show prompts");
  return el("div", {class: "npmdeck"},
    el("div", {class: "npmh"}, "Mind gone blank?"),
    el("b", {}, prompts[(NPM[key] || 0) % prompts.length]),
    el("button", {class: "btn sm", title: "Space, in an empty box", onclick: () => npmDraw(key, prompts.length)}, "Draw another"),
    ...extra,
    el("button", {class: "textbtn", onclick: show(false)}, "Hide prompts"));
}
