function setColsHidden(by, set) { PREF.set(hiddenColsKey(by), JSON.stringify(Array.from(set))); render(); }
