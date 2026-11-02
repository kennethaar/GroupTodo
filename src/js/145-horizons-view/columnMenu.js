function columnMenu(title, hint, cols) {
  const live = cols.flatMap(c => c.rows).filter(r => r && r[0]);
  const body = el("div", {class: "state-cols"}, ...cols.map(c => el("div", {class: "state-col" + (c.cur ? " cur" : "")},
    el("h3", {}, c.head),
    ...c.rows.filter(Boolean).map(([key, label, detail, run]) => pickRow(key, label, detail, () => { closeModal(); run(); })))));
  modal({
    title, hint, body, center: true,
    onKey: e => {
      const hit = live.find(r => r[0] === e.key.toLowerCase());
      if (!hit) return false;
      closeModal(); hit[3]();
      return true;
    },
  });
}
