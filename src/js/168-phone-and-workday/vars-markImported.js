const markImported = () => PREF.set("import.day." + (Spaces.active || ""), todayISO());
const importedToday = () => PREF.get("import.day." + (Spaces.active || ""), "") === todayISO();
