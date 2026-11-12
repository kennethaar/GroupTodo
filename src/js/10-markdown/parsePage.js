/* Parse a markdown page into {props, blocks}. */
function parsePage(text) {
  const lines = String(text || "").split(/\r?\n/);
  const page = {props: {}, blocks: []};
  const root = {level: -1, children: page.blocks};
  const stack = [root];
  let cur = null, curIndent = 0, seenBullet = false;
  let drawer = null;            // the :LOGBOOK: or other drawer being read, if any
  let fence = false;            // inside a ``` fence in the body: lines kept as written (#374)

  for (const line of lines) {
    /* In a fence, a dash or a name:: is part of what was pasted, not a bullet
       or a property. A line out at the bullet's own indent ends it anyway, so
       a stray ``` in an old page cannot swallow the bullets after it. */
    if (fence && cur) {
      const lead = /^\s*/.exec(line)[0].length;
      if (trim(line) === "" || lead >= curIndent + 2) {
        cur.body.push(trim(line) === "" ? "" : line.slice(curIndent + 2).replace(/\s+$/, ""));
        if (/^\s*```/.test(line)) fence = false;
        continue;
      }
      fence = false;
    }
    const bm = BULLET_RE.exec(line);
    if (bm) {
      seenBullet = true;
      drawer = null;            // a drawer left open ends where the next bullet starts
      fence = false;
      const level = indentLevel(bm[1]);
      const [state, title] = splitState(bm[2]);
      const blk = newBlock({state, title: trim(title)}, false);
      while (stack.length > 1 && stack[stack.length-1].level >= level) stack.pop();
      const parent = stack[stack.length-1];
      (parent.children || (parent.children = [])).push(blk);
      blk.level = level;
      stack.push(blk);
      cur = blk; curIndent = bm[1].length;
      continue;
    }
    if (!seenBullet) {
      const pm = PROP_RE.exec(trim(line));
      if (pm) { page.props[pm[1].toLowerCase()] = trim(pm[2]); continue; }
      if (trim(line) === "") continue;
      // Stray prose before the first bullet: keep it as a leading block.
      const blk = newBlock({title: trim(line)}, false);
      page.blocks.push(blk); blk.level = 0;
      stack.length = 1; stack.push(blk); cur = blk; curIndent = 0; seenBullet = true;
      continue;
    }
    if (!cur) continue;
    /* A drawer -- Logseq's :LOGBOOK: of CLOCK lines, or any :NAME: ... :END: --
       is the outliner's bookkeeping, not words anybody means to edit. Kept
       aside, never shown, and written back exactly as it came, so a time log
       is not one stray Backspace from gone. */
    if (drawer) {
      const lead = /^\s*/.exec(line)[0].length;
      drawer.push(line.slice(Math.min(lead, curIndent + 2)).replace(/\s+$/, ""));
      if (trim(line) === ":END:") drawer = null;
      continue;
    }
    if (/^:[A-Z][A-Z_-]*:$/.test(trim(line)) && trim(line) !== ":END:") {
      drawer = [trim(line)];
      (cur.drawers || (cur.drawers = [])).push(drawer);
      continue;
    }
    if (trim(line) === "") { if (cur.body.length) cur.body.push(""); continue; }
    if (/^\s*```/.test(line)) {
      fence = true;
      cur.body.push(line.slice(Math.min(/^\s*/.exec(line)[0].length, curIndent + 2)).replace(/\s+$/, ""));
      continue;
    }
    const pm = PROP_RE.exec(trim(line));
    if (pm) { cur.props[pm[1]] = trim(pm[2]); continue; }
    const lead = /^\s*/.exec(line)[0].length;
    cur.body.push(line.slice(Math.min(lead, curIndent + 2)).replace(/\s+$/, ""));
  }
  // drop trailing blank body lines
  walkBlocks(page.blocks, b => { while (b.body.length && trim(b.body[b.body.length-1]) === "") b.body.pop(); });
  calRemember(page, calKeysOn(page));
  return page;
}
