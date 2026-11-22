/* The linked page is on screen: its line picked and its panel opened, once (#474). */
function linkArrive(link) {
  if (link.arrived) return;
  link.arrived = true;
  const found = link.block ? linkedBlock(link) : null;
  if (found) {
    state.selected = found.id;
    setTimeout(() => openTaskDetail(link.path, found), 120);
  }
  loadMark("link to " + link.path + ": " + (found ? "opened at the line" : "opened"));
}
