/* The project's next action: its first open step with nothing open under it. */
function projectNextAction(path) {
  let next = null;
  walkBlocks((getPage(path) || {}).blocks || [], b => {
    if (!next && (b.state === "TODO" || b.state === "DOING") &&
        !(b.children || []).some(c => OPEN_STATES[c.state])) next = b;
  });
  return next;
}
