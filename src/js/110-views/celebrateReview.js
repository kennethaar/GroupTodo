/* The starfield after "Mark the review done" (#223): the projects reviewed
   this week, or every active one, as cards to fly past. review.celebrate is
   on, quiet (no sound) or off. last_review is saved before this runs; the
   celebration is only visual. */
function celebrateReview() {
  const mode = PREF.get("review.celebrate", "on");
  if (mode === "off" || typeof window.starfieldPlay !== "function") return false;
  const rows = ["1", "3"].flatMap(code => projectsInVisible(code));
  const thisWeek = rows.filter(r => {
    const d = dateIn(inS(r, () => getPage(r.path)?.props?.reviewed));
    return d && dateDiffDays(d, todayISO()) < 7;
  });
  const cards = (thisWeek.length ? thisWeek : rows).map(r => {
    const next = openOf(projectActions(r))[0];
    return [areaOfRow(r) || "Project", inS(r, () => pageTitle(r.path)), next ? next.title : "Add a next action"];
  });
  if (!cards.length) return false;
  const nextOn = shiftISO(todayISO(), CFG.reviewEveryDays);
  window.starfieldPlay(cards, {
    title: "Weekly review done",
    sub: cards.length + (cards.length === 1 ? " project" : " projects") + " reviewed · next review " + humanDate(nextOn),
    sound: mode === "on",
    onEnd: () => render(),
  });
  return true;
}
