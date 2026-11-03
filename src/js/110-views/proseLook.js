function proseLook(paras, style = dialogueStyle()) {
  const out = {words: 0, sentences: 0, longWords: 0, said: 0, long: [], filters: [], adverbs: [], repeats: []};
  for (const p of paras) {
    for (const x of speechParts(p, style).said) out.said += countWords(x);
    for (const s of sentencesOf(p)) {
      const w = wordList(s);
      out.sentences++; out.words += w.length;
      out.longWords += w.filter(x => x.length > 6).length;
      if (w.length > LONG_SENTENCE) out.long.push({text: s, n: w.length});
      const lower = w.map(x => x.toLowerCase());
      lower.forEach((x, i) => {
        if (FILTER_WORDS.has(x)) out.filters.push({word: w[i], text: s});
        if (x.length > 4 && x.endsWith("ly") && !ADVERB_SKIP.has(x)) out.adverbs.push({word: w[i], text: s});
      });
    }
    // The same long word again within a few words: once a paragraph, with the words between.
    const words = wordList(p), lower = words.map(x => x.toLowerCase()), seen = new Set();
    lower.forEach((x, i) => {
      if (x.length < 5 || STOP_WORDS.has(x) || seen.has(x)) return;
      const j = lower.indexOf(x, i + 1);
      if (j > 0 && j - i <= REPEAT_NEAR) { seen.add(x); out.repeats.push({word: x, text: words.slice(i, j + 1).join(" "), para: p}); }
    });
  }
  out.lix = out.sentences ? out.words / out.sentences + 100 * out.longWords / Math.max(1, out.words) : 0;
  out.avg = out.sentences ? out.words / out.sentences : 0;
  out.talk = out.words ? out.said / out.words : 0;
  return out;
}
