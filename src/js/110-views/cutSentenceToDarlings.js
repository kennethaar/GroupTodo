function cutSentenceToDarlings(path, block, text, at) {
  const {start, end} = sentenceAt(text, at), cut = trim(text.slice(start, end));
  if (!cut) return null;
  block.title = trim(text.slice(0, start) + text.slice(end));
  const kept = newBlock({title: cut}, false);
  keepDarling(kept, {from: "[[" + pageRef(path) + "]]", cut: todayISO(), in: ensureBlockId(path, block)});
  touch(path);
  darlingCut(kept, "The sentence");
  return kept;
}
