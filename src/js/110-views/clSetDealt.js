function clSetDealt(keys) { PREF.set("clarify.dealt", JSON.stringify({week: solWeek(), keys: [...keys]})); }
