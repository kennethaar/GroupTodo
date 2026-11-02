function planAiRemember(url) {
  if (PLAN_AIS.some(([u]) => u === url)) return;
  PREF.set("plan.ais", JSON.stringify([url, ...planAiSaved().filter(u => u !== url)]));
}
