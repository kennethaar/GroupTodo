/* The ⋯ on the timer: every setting with its value, each a list to pick from. */
function timerSettingsMenu() {
  chipMenu("Timer", "8/timer.md", lettered([
    ...Object.entries(TIMER_SETTINGS).map(([k, s]) =>
      [s.name + ": " + s.word(timerSettingNow(k)), s.about, () => timerSettingMenu(k)]),
    ["Open the page", "8/timer.md", openTimerPage],
  ]));
}
