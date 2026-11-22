/* An action as a widget line: its words, without the context link the file
   is named for; a sub context's action says which one, "(Kitchen)" (#474). */
function widgetLine(a, ctx) {
  const words = plainTitle(String(a.title || "").replace(/\s*\[\[c\/[^\]]*\]\]/gi, ""))
    .replace(/\s{2,}/g, " ").trim();
  const sub = a.context && a.context !== ctx && a.context.startsWith(ctx + "/")
    ? a.context.slice(ctx.length + 1).split("/").join(" › ") : "";
  return words + (sub ? " (" + sub + ")" : "");
}
