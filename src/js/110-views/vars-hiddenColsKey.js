/* ---------- columns put away ----------
   A context, a person or a tag you are not working on today can be taken off
   the Next or Waiting for board with the x on its head. It waits as a pill
   above the board, one list per way of splitting it, until clicked back. The
   list views read the same lists, so the two always agree. "ctx" is short for
   "next.ctx"; Waiting for passes "waiting.person" and "waiting.tag". */
const hiddenColsKey = by => (by.includes(".") ? by : "next." + by).replace(".", ".hideCols.") + ":" + (Spaces.active || "");
