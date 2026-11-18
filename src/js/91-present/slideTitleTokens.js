/* A layout named in a slide's title (#433): [+] is a 2×2, 📈 or ::curve a
   curve, ::grid cards (::grid-1d in one row). These tokens are not shown.
   "vs" as a word makes a versus slide and stays in the title, since it is
   part of what the title says ("Build vs buy").
   A trailing (Y / X) is returned as axes, and taken off the words only when
   the title itself makes a curve; slideLayout does it for a curve by marks. */
function slideTitleTokens(title) {
  let words = String(title || ""), layout = null, oneD = false;
  for (const [re, id] of [[/::grid-1d\b/, "grid-1d"], [/::grid\b/, "grid"], [/::curve\b/, "curve"],
    [/📈/u, "curve"], [/\[\+\]/, "quadrant"]]) {
    if (!re.test(words)) continue;
    words = words.replace(re, " ");
    if (id === "grid-1d") oneD = true;
    layout ||= id === "grid-1d" ? "grid" : id;
  }
  if (!layout && /(?:^|\s)vs\.?(?=\s|$)/i.test(words)) layout = "split";
  const m = SLIDE_AXES_RE.exec(words);
  const axes = m ? {y: trim(m[1]), x: trim(m[2])} : null;
  if (axes && layout === "curve") words = words.replace(SLIDE_AXES_RE, "");
  return {layout, words: trim(words.replace(/\s{2,}/g, " ")), axes, oneD};
}
