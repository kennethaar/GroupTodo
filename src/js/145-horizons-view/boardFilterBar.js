function boardFilterBar(mode, items) {
  const hidden = boardHidden(mode);
  const bar = el("div", {class: "statefilter", style: "margin-top:2px"});
  let any = false;
  for (const f of BOARD_FILTERS[mode] || []) {
    const yes = items.filter(x => f.test(x)).length;
    const no = items.length - yes;
    if (!yes || !no) continue;
    any = true;
    for (const [side, label, n] of [["yes", f.yes, yes], ["no", f.no, no]]) {
      const id = f.key + ":" + side;
      const other = f.key + ":" + (side === "yes" ? "no" : "yes");
      const on = !hidden.has(id);
      bar.append(el("button", {
        class: "chip filter" + (on ? " on" : ""),
        onclick: () => {
          const next = boardHidden(mode);
          if (next.has(id)) next.delete(id);
          else { next.add(id); next.delete(other); }
          setBoardHidden(mode, next);
          render();
        },
      }, (on ? "\u2713 " : "") + label + " " + n));
    }
  }
  return any ? bar : null;
}
