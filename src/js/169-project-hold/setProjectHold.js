/* day is a date, HOLD_OPEN for no date, or null to take it off hold. */
function setProjectHold(path, day) {
  const page = getPage(path); if (!page) return;
  if (day) {
    for (const k of Object.keys(page.props)) if (k.toLowerCase() === "hold") delete page.props[k];
    page.props.hold = day === HOLD_OPEN ? HOLD_OPEN : "[[" + day + "]]";
  } else endHold(page.props, hasRepeatUnder(page.blocks));
  touch(path); render();
  notify(day === HOLD_OPEN ? pageTitle(path) + " is on hold, no date."
    : day ? pageTitle(path) + " is on hold until " + humanDate(day) + "." : pageTitle(path) + " is back.");
}
