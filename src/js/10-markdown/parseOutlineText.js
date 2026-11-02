/* ---------- loose text into blocks ----------
   Text that arrives from somewhere else -- pasted out of an email, a chat, a
   meeting's minutes -- is already a list. Every line of it is one task, and
   the little marks in front of the words are the list's, not the task's: a
   leading "-" is a bullet, indentation is nesting, and a leading TODO is a
   state. Reading them here is what lets a paste become ten tasks rather than
   one line with ten dashes in it.

   A "key:: value" line belongs to the line above it, so a block copied out of
   the app -- Added, by, assigned and all -- pastes back whole.

   State is left alone when a line does not carry one: only the caller knows
   whether an unmarked line is a task or a note. */
function parseOutlineText(text) {
  const roots = [];
  const stack = [];                       // {level, block, indent}, outermost first
  const lines = String(text || "").replace(/\r\n?/g, "\n").split("\n");
  /* Text with bullets in it is an outline -- most often lines copied out of
     the app -- and there an unbulleted line under a bullet is that line's
     note, the way the file holds it, not a line of its own. */
  const outline = lines.some(l => BULLET_RE.test(l));
  roots.outline = outline;
  for (const raw of lines) {
    if (trim(raw) === "") continue;
    const bm = BULLET_RE.exec(raw);
    const lead = bm ? bm[1] : /^[ \t]*/.exec(raw)[0];
    const level = indentLevel(lead);
    const rest = trim(bm ? bm[2] : raw);
    if (rest === "") continue;
    const top = stack.length ? stack[stack.length - 1] : null;
    const cur = top ? top.block : null;
    const pm = PROP_RE.exec(rest);
    // A bulleted tracker is a line of its own, not a value of the line above.
    if (pm && cur && !(bm && /^tracker-/i.test(rest))) { cur.props[pm[1]] = trim(pm[2]); continue; }
    if (!bm && outline && cur) {
      cur.body.push(raw.slice(Math.min(lead.length, top.indent + 2)).replace(/\s+$/, ""));
      continue;
    }
    const [state, title] = splitState(rest);
    // No template yet: the props a copied task carries come on the lines after
    // it, and readyPastedBlocks decides once they are in.
    const blk = newBlock({state, title: trim(title)}, false);
    while (stack.length && stack[stack.length - 1].level >= level) stack.pop();
    if (stack.length) stack[stack.length - 1].block.children.push(blk);
    else roots.push(blk);
    stack.push({level, block: blk, indent: lead.length});
  }
  return roots;
}
