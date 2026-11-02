/* Contexts kept in folders -- PC/email, PC/build -- are listed together, the
   folder first, so they can be drawn as a column under it and the arrow keys
   walk down one column before the next. Contexts with no folder come first. */
const ctxTop = n => String(n).split("/")[0];
