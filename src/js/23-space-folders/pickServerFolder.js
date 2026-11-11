/* Which of serve.py's free folders an area goes into (#357). One free folder
   is the answer by itself; several are a list to pick from, not to type.
   Resolves the chosen option, or null. */
function pickServerFolder(name, free) {
  if (free.length === 1) return Promise.resolve(free[0]);
  return new Promise(resolve => {
    let settled = false;
    const done = v => { if (!settled) { settled = true; resolve(v); } };
    modal({
      center: true, title: "Which server folder for " + name + "?",
      onClose: () => done(null),
      body: el("div", {style: "display:flex;flex-direction:column;gap:6px"},
        ...free.map(o => el("button", {class: "pick", onclick: () => { done(o); closeModal(); }},
          el("span", {}, el("b", {}, o.name), el("br"),
            el("span", {style: "color:var(--fg3);font-size:12.5px"}, o.path + serverFilesNote(o)))))),
      foot: [el("div", {style: "flex:1"}), el("button", {class: "btn ghost", onclick: () => { done(null); closeModal(); }}, "Cancel")],
    });
  });
}
