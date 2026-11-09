/* [[p/Jane Doe][Jane Doe]] says the name twice: the link reads Jane Doe
   without its text. The text goes when it is exactly what the link would read
   anyway (#338). An alias, other casing or a go/ door keeps its own. */
function dropSameLabels(text) {
  return String(text).replace(/\[\[([^\]]+)\]\[([^\]]*)\]\]/g, (all, ref, label) => {
    const raw = trim(ref);
    const pfx = (/^([^/]+)\//.exec(raw) || [])[1];
    if (pfx === "go") return all;
    const known = pfx === "c" || pfx === "z" || pfx === "p" || pfx === "o" || pfx === "m" ||
                  (pfx && STATUS_DIRS[pfx]);
    return trim(label) === (known ? raw.slice(pfx.length + 1) : raw) ? "[[" + ref + "]]" : all;
  });
}
