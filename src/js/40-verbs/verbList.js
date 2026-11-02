function verbList() {
  return Object.keys(VERB_CANON).sort().map(c => ({canonical: c, lang: VERB_CANON[c].lang}));
}
