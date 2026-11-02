function usageDevice() {
  let id = PREF.get("usage.device", "");
  if (!id) {
    const kind = /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent || "") ? "phone" : "pc";
    id = kind + "-" + Math.random().toString(36).slice(2, 6);
    PREF.set("usage.device", id);
  }
  return id;
}
