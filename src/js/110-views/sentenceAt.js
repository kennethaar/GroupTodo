/* The sentence the caret is in; at the end of the line, the last one. A
   sentence runs to its full stop, ! or ?, the quote after it, and the space,
   unless what follows starts small: “Wait!” he said. is one sentence. */
function sentenceAt(text, at) {
  const ends = [...text.matchAll(/[.!?…]+["”»“’']*(?:\s+(?!\p{Ll})|$)/gu)].map(m => m.index + m[0].length).filter(e => e < text.length);
  const cuts = [0, ...ends, text.length];
  if (at >= text.length) return {start: cuts[cuts.length - 2], end: text.length};
  const i = cuts.findIndex(c => c > at);
  return {start: cuts[i - 1], end: cuts[i]};
}
