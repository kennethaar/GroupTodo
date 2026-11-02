function maybeAskTourCheckoff(list) {
  clearTimeout(TOUR_ASK_TIMER);
  if (!PREF.get("tour.ask", "1")) return;               // turned off from the card
  const here = tourDestHere();
  const steps = (list || tourPending()).filter(s => s.open && s.dest !== here);
  if (!steps.length) return;
  if (tourAskKey(steps) === PREF.get("tour.asked", "")) return;
  TOUR_ASK_TIMER = setTimeout(() => {
    if ($("#modalRoot").firstChild) return;             // something else is talking
    // Read again: the view can have changed in the meantime, and the step you
    // have just walked into is still not one to be asked about.
    const now = tourDestHere();
    const live = steps.filter(s => OPEN_STATES[s.block.state] && s.dest !== now);
    if (live.length) askTourCheckoff(live);
  }, 600);
}
