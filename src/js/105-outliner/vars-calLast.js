const calLast = () => { try { return JSON.parse(PREF.get("calendar.result", "null")); } catch (_) { return null; } };
