function timerDone(mins) {
  const msg = "Time is up: " + mins + " minute" + (mins === 1 ? "" : "s") + ".";
  notify(msg, "warn");
  try {
    if (window.Notification?.permission === "granted") {
      const n = new Notification("GroupTodo: time is up", {body: msg, tag: "gtd-timer",
        icon: "icon.svg", requireInteraction: true, silent: !TIMER_SOUND});
      n.onclick = () => { window.focus(); n.close(); timerAck(); };
    }
  } catch (_) {}
  timerFlash();
  if (TIMER_SOUND) timerChime(6);
  timerPaint();
}
