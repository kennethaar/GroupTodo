/* "Coming from another app?" on the Journal after you start your own (#458),
   until you close it. Each app opens its steps. */
function migrateCard() {
  if (state.view !== "today" || PREF.get("migrate.card", "") !== "1") return null;
  return el("div", {class: "migrate", role: "region", "aria-label": "Coming from another app?"},
    el("div", {class: "mighead"},
      el("b", {}, "Coming from another app?"),
      el("button", {class: "migclose", type: "button", "aria-label": "Close", title: "Close",
        onclick: () => { PREF.set("migrate.card", "0"); render(); }}, "✕")),
    el("div", {class: "migapps"},
      ...MIGRATE_APPS.map(([name]) => el("button", {class: "migapp", type: "button", onclick: () => openMigrateSteps(name)}, name)),
      el("span", {class: "migsay"}, "Bring your notes in.")));
}
