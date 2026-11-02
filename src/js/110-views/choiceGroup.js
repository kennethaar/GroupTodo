/* A sheet of choices, one pressed: pressing another sets it and the sheet
   shows what it is now set to, so a choice is never a guess. */
function choiceGroup(label, opts, cur, set) {
  return el("div", {class: "sheetgroup"}, el("div", {class: "say"}, label),
    el("div", {class: "sheetopts"}, ...opts.map(([v, l]) => el("button", {class: "sheetopt", "aria-pressed": String(v === cur),
      onclick: () => set(v)}, l))));
}
