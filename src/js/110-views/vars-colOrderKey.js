/* ---------- columns put in order ----------
   Dragging a column by its head moves it, and the board remembers the order
   under the same name its hidden columns go by, one per way of splitting it
   and per area. A column the order has never seen -- a tag written for the
   first time -- turns up next to the one it would have followed anyway. */
const colOrderKey = by => hiddenColsKey(by).replace(".hideCols.", ".colOrder.");
