/* ---------- the verb lexicon, in whichever language you think in ----------
   The Phys-Viz rule is about the first word of the line, so the lexicon has to
   hold the words you actually write. Half the people this is for write their
   tasks in Norwegian, and a lexicon that only knows English would quietly mark
   every one of their lines as verbless. */
const VERB_LANG_NAME = {en: "English", no: "Norsk"};
const verbLang = () => {
  const want = PREF.get("verbLang", "");
  return VERB_LANG_NAME[want] ? want : "en";
};
