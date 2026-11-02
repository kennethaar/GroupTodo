// Only the latest choice between two projects is kept, and an old one is let go.
function sdSave(space, list) {
  const keep = new Map();
  for (const x of list) if (sdFresh(x)) keep.set(sdPairKey(x.w, x.l), x);
  inSpace(space, () => setSetting(sdK().setting, [...keep.values()].map(x => x.w + " > " + x.l + " " + x.at).join(" | ")));
}
