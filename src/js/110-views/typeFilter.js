function typeFilter(rows, key) {
  const names = [...new Set([...rows.map(typeOfRow),
    ...acrossSpaces(() => stateLists().map(p => ({t: pageTitle(p)}))).map(x => x.t)].filter(Boolean))]
    .sort((a, b) => a.localeCompare(b));
  let cur = PREF.get(key, "");
  if (cur && cur !== "-" && !names.includes(cur)) cur = "";
  const keep = r => !cur || (cur === "-" ? !typeOfRow(r) : typeOfRow(r) === cur);
  /* Only once a task in the list has a type: a choice that can only find
     everything, or nothing, is noise. */
  const sel = cur || rows.some(typeOfRow) ? fselect("Type", cur, [["", "All types"], ["-", "No type"], ...names.map(t => [t, t])],
    v => { PREF.set(key, v); render(); }) : null;
  return {cur, keep, sel};
}
