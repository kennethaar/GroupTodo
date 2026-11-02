/* ---------- Settings > Writing ---------- */
function writingSettingsSection() {
  const items = Object.entries(SUGGEST_KEYS).map(([key, k]) => ({key, label: k.label, blurb: k.blurb}));
  return section("Writing", null, el("div", {class: "card writeset"},
    el("div", {class: "listblurb"}, "Take a suggestion or run a / command with. On this device."),
    segPicker(items, suggestKeys(), k => PREF.set("suggest.accept", k))));
}
