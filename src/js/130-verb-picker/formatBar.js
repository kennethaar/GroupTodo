/* The Format choices for a notes box (#416), the same ones the line tools
   offer: a heading level or Quote marks the line the caret is on (the same
   one again takes it off), Bold and Italic wrap the picked words or the word
   at the caret, Table adds one on a line of its own. A press does not take
   the caret out of the box. */
function formatBar(ta) {
  const act = k => {
    const v = ta.value, a = ta.selectionStart, z = ta.selectionEnd;
    let text = v, s = a, e = z;
    if (k === "bold" || k === "italic") {
      const m = k === "bold" ? "**" : "*", n = m.length;
      let x = a, y = z;
      if (x === y) { while (x > 0 && /[\p{L}\p{N}_'-]/u.test(v[x - 1])) x--; while (y < v.length && /[\p{L}\p{N}_'-]/u.test(v[y])) y++; }
      if (v.slice(x - n, x) === m && v.slice(y, y + n) === m) { text = v.slice(0, x - n) + v.slice(x, y) + v.slice(y + n); s = x - n; e = y - n; }
      else { text = v.slice(0, x) + m + v.slice(x, y) + m + v.slice(y); s = x + n; e = y + n; }
    } else if (k === "table") {
      const t = [tableRowText(["Column 1", "Column 2"]), tableRowText(["---", "---"]), tableRowText(["", ""])].join("\n");
      const before = v.slice(0, a), lead = before && !before.endsWith("\n") ? "\n" : "";
      text = before + lead + t + "\n" + v.slice(z);
      s = e = before.length + lead.length + 2;
    } else {
      const start = v.lastIndexOf("\n", a - 1) + 1;
      const line = v.slice(start), had = (/^(#{1,6}[ \t]+|>[ \t]+)/.exec(line) || [, ""])[1];
      const want = k === "quote" ? "> " : "#".repeat(+k[1]) + " ";
      const mark = trim(had) === trim(want) ? "" : want, shift = mark.length - had.length;
      text = v.slice(0, start) + mark + v.slice(start + had.length);
      s = Math.max(start + mark.length, a + shift); e = Math.max(start + mark.length, z + shift);
    }
    ta.value = text;
    ta.focus();
    ta.setSelectionRange(s, e);
    ta.dispatchEvent(new Event("input", {bubbles: true}));
  };
  const rows = EDIT_BAR.filter(r => r.group === "format");
  return el("div", {class: "fmtbar", role: "toolbar", "aria-label": "Format"}, ...rows.map(r =>
    el("button", {type: "button", class: "iconbtn", data: {k: r.k}, title: r.tip, "aria-label": r.label,
      onmousedown: ev => ev.preventDefault(), onclick: () => act(r.k)},
    r.ic.startsWith("<") ? svgIcon(r.ic) : r.ic)));
}
