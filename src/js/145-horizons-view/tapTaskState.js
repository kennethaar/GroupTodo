/* One task icon, one behaviour, wherever the task is drawn -- its row in a
   list, its own line, an embed or a query: a tap ticks it done (or back to
   To do), holding it or a right-click offers every state. */
function tapTaskState(path, b) {
  setBlockState(path, b, !b.state || b.state === "DONE" ? "TODO" : "DONE");
}
