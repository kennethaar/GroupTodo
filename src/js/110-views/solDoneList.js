/* The pile of what this pass has reviewed, opened: the last three, the rest
   on asking, and any of them dealt again with a click. */
function solDoneList(pass, all = false) {
  const keys = [...SOL_ANS].filter(([k, a]) => (k[0] === "@") === actDeckOn() && a["p" + pass])
    .sort(([, a], [, b]) => (b["t" + pass] || 0) - (a["t" + pass] || 0)).map(([k]) => k);
  const name = k => {
    if (k[0] === "@") return k.split("|").slice(2).join("|");
    const n = k.indexOf("|"), space = k.slice(0, n), path = k.slice(n + 1);
    return inSpace(space, () => V.pages.has(path) ? pageTitle(path) : baseName(path));
  };
  const shown = all ? keys : keys.slice(0, 3);
  modal({title: "Reviewed in this pass", center: true,
    body: el("div", {style: "display:flex;flex-direction:column;gap:6px"},
      keys.length ? null : el("p", {}, "Nothing reviewed in this pass yet."),
      ...shown.map(k => el("div", {style: "display:flex;gap:8px;align-items:center"},
        el("span", {style: "flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"}, "✓ " + name(k)),
        el("button", {class: "btn sm ghost", title: "Deal this card again, to change what it was given",
          onclick: () => { closeModal(); solBack(k); }}, "‹ Back to it"))),
      keys.length > shown.length ? el("button", {class: "textbtn", style: "align-self:flex-start",
        onclick: () => solDoneList(pass, true)}, "Show all " + keys.length) : null)});
}
