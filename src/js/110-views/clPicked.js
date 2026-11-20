/* The lines picked by a drag in the day page beside the card, the ones still
   to be asked: an answer goes to them rather than to the card (#460). */
function clPicked(r) {
  if (!r || LINE_SEL.path !== r.path || !LINE_SEL.ids.length) return [];
  const got = lineSelBlocks(), dealt = clDealt();
  return got ? got.blocks.filter(b => dayCandidate(b) && !dealt.has(clKey(r.path, b))) : [];
}
