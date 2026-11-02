/* A hold that ended, kept as the day it ended when chores sit under it, so
   their freshness counts from the day you were back, not from before you
   left. Anything else just loses its hold::. */
function endHold(props, hasChores) {
  for (const k of Object.keys(props || {})) if (k.toLowerCase() === "hold") delete props[k];
  if (hasChores) props.hold = "[[" + todayISO() + "]]";
}
