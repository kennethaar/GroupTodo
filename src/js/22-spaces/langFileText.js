/* The whole file, in catalog order, so two people's files line up line by line.
   Lines the catalog does not have (added by hand, or from a newer app) stay. */
function langFileText(name, props, pairs) {
  const line = k => k + " =>" + (pairs.get(k) ? " " + pairs.get(k) : "");
  const known = new Set([...LANG_CATALOG.s, ...LANG_CATALOG.t, ...(LANG_CATALOG.w || [])]);
  const extra = [...pairs.keys()].filter(k => !known.has(k));
  const head = {language: name, code: name === LANG_BASE ? "en" : "", ...props};
  head.language = name;
  return [
    ...Object.entries(head).filter(([, v]) => v != null && v !== "").map(([k, v]) => k + ":: " + v),
    "",
    "# GroupToDo language file. One line per piece of text on screen.",
    "# A translation goes after =>, for example:   Today => I dag",
    "# {1}, {2} stand for a number or name the app fills in; keep them in the translation.",
    "# A line with nothing after => stays in English. Lines starting with # are notes.",
    "",
    ...LANG_CATALOG.s.map(line),
    "", "# Sentences with a value in them",
    ...LANG_CATALOG.t.map(line),
    "", "# Words for dates and times, read in what you write: \"neste onsdag kl 13\".",
    "# Several words after => are separated by commas:   when: tomorrow => i morgen, imorgen",
    ...(LANG_CATALOG.w || []).map(line),
    ...(extra.length ? ["", "# Not in the app's own list", ...extra.map(line)] : []),
  ].join("\n") + "\n";
}
