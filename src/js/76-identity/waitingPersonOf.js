function waitingPersonOf(b, page) {
  if (b?.state !== "WAIT") return "";
  const explicit = waitingPersonName(blockProp(b, "waiting_for") || blockProp(b, "waiting-for") || blockProp(b, "waiting_on"));
  if (explicit) return explicit;
  const title = trim(b.title || "");
  // Asked for every WAIT line in the vault, so the list is made once per render.
  const {names, slugs, lower} = memo("peopleNames\u0000" + (V.space || ""), () => {
    const names = [...new Set(allPeople().map(personName))];
    return {names, slugs: new Set(names.filter(Boolean).map(slugPerson)),
            lower: names.map(n => n.toLocaleLowerCase())};
  });
  const known = text => {
    const linked = [...String(text || "").matchAll(/\[\[([^\]]+?)(?:\]\[[^\]]*)?\]\]/g)]
      .map(m => waitingPersonName(m[1]))
      .filter(n => !!n && slugs.has(slugPerson(n)));
    return [...new Map(linked.map(n => [slugPerson(n), n])).values()];
  };
  const unique = known(title);
  if (unique.length === 1) return unique[0];
  if (unique.length > 1) return "";
  const text = plainTitle(title).trim().toLocaleLowerCase();
  const leading = names.filter((n, i) => {
    const key = lower[i];
    return text === key || (text.startsWith(key) && /^[\s,:;.!?()\-]/.test(text.slice(key.length, key.length + 1)));
  }).sort((a, b) => b.length - a.length);
  if (leading.length && (leading.length === 1 || leading[0].length > leading[1].length)) return leading[0];
  /* Nobody on the line itself: the nearest line above that names somebody
     names them for it, the way a [[1/project]] above a line files it.
       - [[p/Joe Newmann]]
         - WAIT Will find paneling ties
     waits on Joe. */
  for (let p = b._parent; p; p = p._parent) {
    const up = known(p.title);
    if (up.length) return up.length === 1 ? up[0] : "";
  }
  return waitingPersonName(page?.props?.waiting_for || page?.props?.["waiting-for"] || page?.props?.waiting_on);
}
