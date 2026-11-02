function setHiddenStates(set) {
  PREF.set("hideStates:" + (Spaces.active || ""), JSON.stringify(Array.from(set)));
}
