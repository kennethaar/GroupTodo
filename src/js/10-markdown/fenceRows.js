/* Which of a block's body lines sit in a ``` fence (#374): 1 for a fence line,
   2 for a line inside one, 0 otherwise. A pasted mockup is kept in one, so
   its lines are drawn as written, in the monospace font. A fence left open
   runs to the end of the body, as markdown reads it. */
function fenceRows(b) {
  let open = false;
  return (b.body || []).map(l => {
    if (/^\s*```/.test(l)) { open = !open; return 1; }
    return open ? 2 : 0;
  });
}
