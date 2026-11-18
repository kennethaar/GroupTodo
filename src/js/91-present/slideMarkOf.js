/* The layout the marks on these lines give now (#433), as the Slide layout
   menu names it: the mark most of them carry, a tie going to the first
   line's; "| " is "split" on any number of lines. Null when none has one. */
function slideMarkOf(lines) {
  const marks = lines.map(k => slideMark(k.title).layout), count = {};
  for (const m of marks) if (m) count[m] = (count[m] || 0) + 1;
  const top = Math.max(0, ...Object.values(count));
  return top ? marks.find(m => m && count[m] === top) : null;
}
