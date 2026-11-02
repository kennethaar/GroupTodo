const setBoardHidden = (mode, set) =>
  PREF.set(boardFilterKey(mode), JSON.stringify(Array.from(set)));
