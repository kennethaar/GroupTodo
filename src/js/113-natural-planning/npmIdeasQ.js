/* Capture fast: a pile with nothing to edit, so there is nothing to stop and judge. */
function npmIdeasQ() {
  const input = el("input", {class: "npmin", placeholder: "Type an idea and press Enter", "aria-label": "An idea"});
  NPM_PENDING = () => { const v = trim(input.value); if (v) { NPM.ideas.push({id: uid(), t: v, to: null}); npmSave(); } };
  const draw = () => { NPM.deck = (NPM.deck + 1) % NPM_TRIGGERS.length; npmSave(); render(); };
  input.addEventListener("keydown", e => {
    if (e.key === " " && !input.value && !NPM.hideDeck) { e.preventDefault(); draw(); return; }
    if (e.key !== "Enter" || e.ctrlKey || e.metaKey) return;
    e.preventDefault();
    const v = trim(input.value);
    if (!v) { npmNext(); return; }
    NPM.ideas.push({id: uid(), t: v, to: null}); npmSave(); render();
  });
  const pile = el("div", {class: "npmpile"},
    el("div", {class: "npmh"}, NPM.ideas.length ? NPM.ideas.length + " ideas · you sort them in the next step" : "The pile is empty"),
    el("ul", {class: "npmlines plain"}, ...NPM.ideas.slice().reverse().map(i => el("li", {}, "• " + i.t))));
  const deck = NPM.hideDeck
    ? el("button", {class: "textbtn", onclick: () => { NPM.hideDeck = false; npmSave(); render(); }}, "Show prompts")
    : el("div", {class: "npmdeck"},
        el("div", {class: "npmh"}, "Mind gone blank?"),
        el("b", {}, NPM_TRIGGERS[NPM.deck % NPM_TRIGGERS.length]),
        el("button", {class: "btn sm", title: "Space, in an empty box", onclick: draw}, "Draw another"),
        // Only once there are ideas of your own: the AI adds to your thinking, it does not start it.
        NPM.ideas.length >= 3 ? el("button", {class: "btn sm ghost", title: "Copies a prompt for your AI. Its ideas are marked ✧",
          onclick: npmAiAsk}, "✧ Draw 3 AI triggers") : null,
        NPM.ai ? npmAiPaste() : null,
        el("button", {class: "textbtn", onclick: () => { NPM.hideDeck = true; npmSave(); render(); }}, "Hide prompts"));
  return [input, el("div", {class: "npmcap"}, pile, deck)];
}
