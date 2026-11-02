/* A phrase, lower case, with the chosen language's words put into English --
   the longest run of words first, whole words only. */
function whenEnglish(p) {
  const vocab = LANG.when;
  if (!vocab || !vocab.size) return p;
  const longest = Math.max(...[...vocab.keys()].map(k => k.split(" ").length));
  const words = String(p).split(/\s+/), out = [];
  for (let i = 0; i < words.length;) {
    let n = Math.min(longest, words.length - i);
    for (; n > 1 && !vocab.has(words.slice(i, i + n).join(" ")); n--) {}
    const en = vocab.get(words.slice(i, i + n).join(" "));
    out.push(en != null ? en : words[i]);
    i += en != null ? n : 1;
  }
  return out.join(" ");
}
