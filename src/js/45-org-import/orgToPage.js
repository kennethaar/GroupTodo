/* ============================================================
   45_ORG_IMPORT -- convert an existing .org vault to markdown
   ============================================================ */
function orgToPage(text) {
  const lines = String(text || "").split(/\r?\n/);
  const page = {props: {}, blocks: []};
  const stack = [{level: 0, children: page.blocks}];
  let cur = null, inProps = false;

  for (const line of lines) {
    let m = /^#\+([\w-]+):\s*(.*)$/.exec(line);
    if (m && !cur) { page.props[m[1].toLowerCase()] = trim(m[2]); continue; }
    m = /^(\*+)\s+(.*)$/.exec(line);
    if (m) {
      const level = m[1].length;
      const [state, title] = splitState(m[2]);
      const blk = newBlock({state, title: trim(title)});
      while (stack.length > 1 && stack[stack.length-1].level >= level) stack.pop();
      stack[stack.length-1].children.push(blk);
      blk.level = level; blk.children = blk.children || [];
      stack.push(blk);
      cur = blk; inProps = false;
      continue;
    }
    if (!cur) continue;
    if (/^\s*:PROPERTIES:\s*$/.test(line)) { inProps = true; continue; }
    if (/^\s*:END:\s*$/.test(line))        { inProps = false; continue; }
    if (inProps) {
      const pm = /^\s*:([\w-]+):\s*(.*)$/.exec(line);
      if (pm) cur.props[pm[1].toLowerCase()] = trim(pm[2]);
      continue;
    }
    // "Added: [[2026-09-15]] - [[2026-09-17]] = 2 days"  ->  property
    const am = /^\s*(Added|CLOSED|SCHEDULED|DEADLINE):\s*(.*)$/i.exec(line);
    if (am) { cur.props[am[1].replace(/^./, c => c.toUpperCase())] = trim(am[2]); continue; }
    if (trim(line) === "") { if (cur.body.length) cur.body.push(""); continue; }
    cur.body.push(trim(line));
  }
  walkBlocks(page.blocks, b => { while (b.body.length && trim(b.body[b.body.length-1]) === "") b.body.pop(); });
  return page;
}
