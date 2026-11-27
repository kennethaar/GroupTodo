/* [{path, block, trail}], oldest day first, in the order they are written.
   trail is the lines it is written under. Of today, only what Catch up put
   there (#516). */
function clarifyDeck() {
  const dealt = clDealt(), out = [], caught = catchUpCaptured(), today = todayISO();
  for (const path of daysToClarify()) {
    const now = baseName(path) === today;
    const walk = (blocks, trail) => {
      for (const b of blocks || []) {
        if (isMessage(b)) continue;
        if (dayCandidate(b) && !dealt.has(clKey(path, b)) && (!now || caught.has(clKey(path, b)))) out.push({path, block: b, trail});
        walk(b.children, trail.concat(plainTitle(bujoText(b.title || ""))));
      }
    };
    walk(getPage(path).blocks, []);
  }
  const back = out.filter(r => CL.skip.has(clKey(r.path, r.block)));
  return out.filter(r => !back.includes(r)).concat(back);
}
