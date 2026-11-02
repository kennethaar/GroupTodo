// Sense where I am, now: asked for, so it switches and says why.
async function senseNow() {
  if (!PREF.get("sense.set", "")) { openSenseSetup(); return; }
  const g = await senseGuess(true);
  if (!g) {
    notify("Cannot tell where you are.", "info",
      {label: "Pick", run: () => openContextPicker("Where are you now?", surfaceContext)});
    return;
  }
  surfaceContext(makeContext(g.ctx), g.why);
}
