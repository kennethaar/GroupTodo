function setFactsFolded(folded) {
  for (const kind of Object.keys(PAGE_KINDS)) PREF.set(factsFoldKey(kind), folded ? "1" : "0");
}
