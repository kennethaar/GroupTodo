/* Offered, never done behind your back: moving one project is your decision,
   and moving four more of somebody else's is a different decision. */
function offerCascade(space, path) {
  const waiting = inSpace(space, () =>
    dependentsOf(path).filter(d => chainTrouble(d)).length);
  if (!waiting) return;
  notify(waiting + " project" + (waiting === 1 ? "" : "s") + " downstream now start" +
         (waiting === 1 ? "s" : "") + " too early.", "warn",
    {label: "Push them along", run: () => {
      const moved = inSpace(space, () => cascadePush(path));
      notify(moved.length ? "Moved " + moved.map(p => inSpace(space, () => pageTitle(p))).join(", ") + "."
                          : "Nothing needed moving after all.");
      render();
    }});
}
