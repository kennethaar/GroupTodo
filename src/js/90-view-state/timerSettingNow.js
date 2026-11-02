function timerSettingNow(k) {
  return {minutes: timerDefaultMinutes(), max: timerMax(), style: timerDialStyle() ? "dial" : "bar",
          volume: Math.round(timerVolume() * 100)}[k];
}
