function remindUsual() {
  const v = PREF.get(REMIND_LEAD_KEY, ""), n = Number(v);
  return v !== "" && Number.isFinite(n) && n >= 0 ? n : CFG.remindLeadMinutes;
}
