/* What a (map) slide's lines are (#488), each a click, in order:
   {kind: "text" | "card" | "badge" | "pin", block, lines, pins, name, run}.
   - A line that starts with an emoji is a pin. Pins one after another
     straight under the slide are one pin that travels (`run` numbers it).
   - A line that is only a picture is a card: the picture, then its own
     lines; with none, the plain lines right after it.
   - A picture with words is a badge: a logo and its name.
   - Pins under a card or a badge are theirs; any other line is text. */
function slideMapItems(kids) {
  const items = [];
  const pinOf = b => SLIDE_PIN_RE.exec(trim(slideWords(b)));
  const picOf = b => slidePicture(b.title || "");
  const words = b => trim(String(b.title || "").replace(/!\[[^\]]*\]\([^)]*\)/g, ""));
  let run = 0, last = null;
  for (let i = 0; i < kids.length; i++) {
    const b = kids[i];
    if (pinOf(b)) {
      if (last?.kind !== "pin") run++;
      items.push(last = {kind: "pin", block: b, lines: [], pins: [b], name: "", run});
      continue;
    }
    const pic = picOf(b), own = (b.children || []).filter(c => !slideHidden(c));
    const mine = {block: b, lines: own.filter(c => !pinOf(c)), pins: own.filter(c => pinOf(c)), run: 0};
    if (pic && !words(b)) {
      // A card written flat: the plain lines after its picture are its own.
      if (!own.length) while (i + 1 < kids.length && !pinOf(kids[i + 1]) && !picOf(kids[i + 1])) mine.lines.push(kids[++i]);
      mine.kind = "card";
      mine.name = mine.lines[0] ? withoutMarks(slideWords(mine.lines[0])) : "";
    } else if (pic) {
      mine.kind = "badge";
      mine.name = withoutMarks(slideWords({title: words(b)}));
    } else mine.kind = "text";
    items.push(last = mine);
  }
  return items;
}
