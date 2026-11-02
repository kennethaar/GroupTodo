/* Teach the lexicon a word. One file, the same shape scanVerbs already reads:
   pages/verbs/<lang>/<word>.md with "word = word" inside it. */
function teachVerb(word, lang) {
  const canonical = trim(word).toLowerCase();
  if (!canonical || /[^\p{L}\p{M}\- ]/u.test(canonical)) return null;
  const path = join(DIRS.verbs, lang, canonical + ".md");
  if (!V.pages.has(path)) {
    putPage(path, {props: {title: canonical, type: "verb", lang},
                   blocks: [newBlock({title: canonical + " = " + canonical})]});
  }
  scanVerbs();
  return path;
}
