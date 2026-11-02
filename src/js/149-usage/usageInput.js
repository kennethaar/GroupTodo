function usageInput(e) {
  const now = Date.now();
  USAGE.lastInput = now;
  // Typing a sentence is one thing done, not forty: keys count once per pause.
  if (e.type === "keydown") {
    const typing = now - USAGE.lastKey < 2000;
    USAGE.lastKey = now;
    if (typing) return;
  }
  usageBump(USAGE.place, 2, 1);
}
