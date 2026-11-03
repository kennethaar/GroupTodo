/* The entries of a changelog, newest first: {version, date, items}. An item's
   head is the name before its colon ("Book › Revise (#254): ..."), when it
   has a short one, and issue the number it closed. */
function newsEntries(text) {
  const out = [];
  for (const e of String(text || "").split(/^## /m).slice(1)) {
    const [head, ...rest] = e.split("\n");
    const m = /^(\d+\.\d+\.\d+)(?:\s*-\s*(\S+))?/.exec(trim(head));
    if (!m) continue;
    const items = rest.join("\n").split(/^- /m).slice(1).map(x => {
      const text = x.replace(/\s+/g, " ").replace(/[`*]/g, "").trim();
      const h = /^([^:]{3,60}?)(?:\s*\(#\d+\))?:\s/.exec(text);
      const issue = (/\(#(\d+)\)/.exec(text) || [])[1] || null;
      return {text, head: h ? h[1] : null, issue};
    });
    out.push({version: m[1], date: m[2] || "", items});
  }
  return out;
}
