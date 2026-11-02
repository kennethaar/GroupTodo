function timerSettingMenu(k) {
  const s = TIMER_SETTINGS[k], now = String(timerSettingNow(k));
  const values = k === "minutes" ? s.values.filter(v => v <= timerMax()) : s.values;
  const set = v => { ensureTimerPage(); saveRawProp(TIMER_PATH, k, k + ":: " + v); render(); };
  const has = getPage(TIMER_PATH)?.props?.[k] != null;
  chipMenu(s.name, s.about, lettered([
    ...values.map(v => [s.word(v), [String(v) === now ? "in use" : "", s.detail?.(v)].filter(Boolean).join(", ") || null,
      () => set(v)]),
    ["Another value", null, () => { ensureTimerPage(); writePropValue(TIMER_PATH, k, has ? now : ""); }],
    has ? ["Take it off", "back to the default", () => { saveRawProp(TIMER_PATH, k, ""); render(); }] : null,
  ]));
}
