/* The words for a line start ("=", "!"): every word list of yours that names
   it, or the built-in Feelings for = while you have none. */
function wordsForLines(mark) {
  const own = allPages(isWordList).filter(p => trim(getPage(p).props.lines || "") === mark);
  if (own.length) return own.flatMap(wordTreeOf);
  return mark === "=" ? builtinFeelings() : [];
}
