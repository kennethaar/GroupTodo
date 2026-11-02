function openContextChipMenu(a) {
  /* The other contexts are listed here rather than behind a "change the
     context" that opens a picker: you already know which one you want, and
     making you ask for the list first is a click that buys nothing. */
  let i = 0, first = true;
  const rows = [[MENU_KEYS[i++], "Go to @" + a.context, "the oldest few, surfaced",
                 () => surfaceContext(a.context)]];
  for (const ctx of contextList()) {
    if (ctx === a.context) continue;
    rows.push([MENU_KEYS[i++] || "", "@" + ctx, first ? "change it to this" : null,
      () => inSpace(a.space, () => replaceContextLink(a.path, a.block, ctx))]);
    first = false;
  }
  // Inherited from the line above: there is nothing on this line to take off.
  const inherited = contextInherited(a.block);
  if (!inherited) rows.push([MENU_KEYS[i++] || "", "Take the context off", "the words stay",
    () => inSpace(a.space, () => removeContextLink(a.path, a.block))]);
  chipMenu("@" + a.context, inherited ? "from the line above - changing it here gives this line its own"
                                      : "the context on this action", rows);
}
