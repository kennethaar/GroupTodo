function setVisibleSpaces(names) {
  PREF.set("visibleSpaces", JSON.stringify(Array.from(new Set(names))));
}
