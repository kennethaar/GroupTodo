function nextGuessCtx(acts, now = new Date()) {
  if (NEXT_GUESS_OFF === hourKey(now)) return null;
  const l = senseLearned("ctx", now);
  let g = l ? (l.v === "*" ? null : {ctx: l.v, why: "where you usually are now"}) : null;
  if (!l && PREF.get("sense.set", "")) {
    const r = guessContext({device: senseDevice(), net: senseNetwork(), pos: SENSE_POS, places: sensePlaces(),
      here: senseHere(), away: senseAway(), work: senseWork(), now});
    if (r) g = r;
  }
  return g && acts.some(a => !isChore(a) && inContext(a, g.ctx)) ? g : null;
}
