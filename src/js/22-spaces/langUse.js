/* Show the screen in this language. English with no lines changed is the app
   as written, with nothing watching it. */
function langUse(name, text) {
  const {props, pairs} = langParse(text || "");
  if (document.body) langRevert();
  LANG.name = name || LANG_BASE;
  LANG.code = props.code || (LANG.name === LANG_BASE ? "en" : "");
  LANG.known = new Set(pairs.keys());
  LANG.missed = new Set();
  LANG.when = whenVocab(pairs);
  langCompile(pairs);
  LANG.on = LANG.dict.size > 0 || [...LANG.tpl.values()].some(l => l.some(t => t.to));
  document.documentElement.lang = LANG.on && LANG.code ? LANG.code : "en";
  langObserve(LANG.on);
  if (LANG.on && document.body) langWalk(document.body);
}
