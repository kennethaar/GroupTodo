const markSent = () => PREF.set(sentKey(), nowStamp());
const unsentEdits = () => (PREF.get(editKey(), "") || "") > (PREF.get(sentKey(), "") || "");
