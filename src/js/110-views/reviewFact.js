/* The review's fields that have no line of their own: always shown on a
   project, set or not, and the pill opens the same chooser the review uses. */
function reviewFact(path, k, key, prop) {
  const r = {space: V.space, path};
  const f = solFields().find(x => x.k === k);
  const text = projectFieldText(r, f);
  /* The next action is not a value you type here: it is the project's first
     open step, read from its lines. Empty, the pill adds one. */
  const open = k === "next" ? (text ? null : () => openAddNextAction(path)) : () => openProjectField(r, k);
  const fact = {
    key, raw: prop ? prop + ":: " + (getPage(path)?.props?.[prop] || "") : null, own: true,
    pills: () => [factPill(text || "+ " + fieldWord(f), text ? "fquiet" : "fwant", f.label, open)],
  };
  if (prop) fact.save = v => saveRawProp(path, prop, v);
  return fact;
}
