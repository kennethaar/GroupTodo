/* Folder to folder, the pages are already safe where they are, so copying
   them is a choice and not the default: moving an area off a folder it was
   wrongly given used to copy that whole folder, a file at a time, into the
   new one. Resolves true to copy. */
function askCarryPages(name, fromLabel, toLabel, count) {
  return new Promise(resolve => {
    let settled = false;
    const done = v => { if (!settled) { settled = true; resolve(v); } };
    modal({
      center: true, title: "Bring the pages along?",
      onClose: () => done(false),
      body: el("div", {class: "field"},
        el("div", {style: "font-size:13.5px"},
          name + " now lives in “" + toLabel + "”. The " +
          (count ? count + " pages" : "pages") + " in “" + fromLabel + "” stay where " +
          "they are either way."),
        el("div", {style: "color:var(--fg3);font-size:12.5px;margin-top:8px"},
          "Copy them only if you are moving this area. If “" + fromLabel + "” was the " +
          "wrong folder - somebody else's, or a shared one - leave them, and nothing of it " +
          "ends up in “" + toLabel + "”.")),
      foot: [
        el("button", {class: "btn ghost", onclick: () => { closeModal(); done(true); }},
          "Copy " + (count ? count + " pages" : "them") + " over"),
        el("div", {style: "flex:1"}),
        el("button", {class: "btn primary", onclick: () => { closeModal(); done(false); }}, "Leave them"),
      ],
    });
  });
}
