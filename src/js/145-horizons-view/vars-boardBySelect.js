const boardBySelect = (pref, options) => fselect("Columns", PREF.get(pref, options[0][0]), options,
  v => { PREF.set(pref, v); render(); });
