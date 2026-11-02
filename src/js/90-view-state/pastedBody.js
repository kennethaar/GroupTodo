/* What was pasted, less its first line, ready to be the body of a page. */
function pastedBody(raw) {
  const lines = String(raw || "").replace(/\r\n?/g, "\n").split("\n");
  const first = lines.findIndex(l => trim(l));
  const roots = parseOutlineText(lines.slice(first + 1).join("\n"));
  readyPastedBlocks(roots);
  return roots;
}
