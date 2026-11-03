/* The lines as paragraphs: [{who: name, text}] in, prose lines out. */
function scriptToProse(rows, style = dialogueStyle()) {
  const st = DIALOGUE[style] || {open: "\"", close: "\"", line: false}, said = saidWord(style), out = [];
  const english = style === "english" || style === "british" || !style;
  let prev = null, before = null;
  rows.forEach(r => {
    const text = trim(r.text);
    if (!text) return;
    const tag = out.length < 2 || !(r.who === before && r.who !== prev);
    const end = /[.?!…]$/.test(text) ? text.slice(-1) : "";
    let line;
    if (!tag) line = st.line ? "– " + text + (end ? "" : ".") : st.open + text + (end ? "" : ".") + st.close;
    else {
      const body = end === "." ? text.slice(0, -1) : text, mark = end && end !== "." ? "" : ",";
      line = st.line ? "– " + body + mark + " " + said + " " + r.who + "."
        : english ? st.open + body + mark + st.close + " " + said + " " + r.who + "."
        : st.open + body + st.close + mark + " " + said + " " + r.who + ".";
    }
    out.push(line);
    if (r.who !== prev) { before = prev; prev = r.who; }
  });
  return out;
}
