/* The lines under a bullet, written in the notepad: each run of lines drawn
   with spaces or box marks is put in a ``` fence, so the file keeps it as it
   was written (#374, #392). Lines already in a fence are left as they are. */
function notepadFence(lines) {
  const out = [];
  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (/^\s*```/.test(l)) { inFence = !inFence; out.push(l); continue; }
    if (inFence || !looksPreformatted([l])) { out.push(l); continue; }
    // A blank line inside a drawing belongs to it when the drawing goes on.
    let j = i;
    while (j + 1 < lines.length && !/^\s*```/.test(lines[j + 1]) &&
           (looksPreformatted([lines[j + 1]]) ||
            (trim(lines[j + 1]) === "" && j + 2 < lines.length && looksPreformatted([lines[j + 2]])))) j++;
    out.push("```", ...lines.slice(i, j + 1), "```");
    i = j;
  }
  return out;
}
