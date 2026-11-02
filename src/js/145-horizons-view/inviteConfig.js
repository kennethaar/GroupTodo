function inviteConfig() {
  const sp = Spaces.get(Spaces.active) || {};
  // The name the folder carries, when it has one: one name, however they come in.
  const named = trim(String(V.pages.get(SETTINGS_PATH)?.props?.area_name || ""));
  const cfg = {v: 1, space: named || sp.name, color: sp.color, from: whoAmI() || null, at: nowStamp()};
  if (sp.kind === "http" && sp.server) { cfg.kind = "http"; cfg.server = sp.server; }
  else if (sp.kind === "fs") { cfg.kind = "fs"; cfg.folder = sp.label || sp.name; }
  else cfg.kind = "local";
  return cfg;
}
