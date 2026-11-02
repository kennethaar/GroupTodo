/* The lines as text with their shape: a step under a line indented under it. */
function linesAsText(blocks) {
  const out = [];
  const rec = (list, depth) => list.forEach(b => {
    out.push("  ".repeat(depth) + (b.state ? b.state + " " : "") + (b.title || ""));
    rec(b.children || [], depth + 1);
  });
  rec(blocks, 0);
  return out.join("\n");
}
