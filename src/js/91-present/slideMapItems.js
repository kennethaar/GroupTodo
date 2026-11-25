/* What a (map) slide's lines are (#488), each a click, in order:
   {kind: "text" | "card" | "badge" | "pin", block, lines, pins, name, run, key, lead}.
   - A line that starts with an emoji is a pin.
   - A line that is only a picture is a card: the picture, then its own
     lines; with none, the plain lines right after it.
   - A picture with words is a badge: a logo and its name.
   - Pins under a card or a badge are theirs; any other line is text.
   The same emoji, the same picture or the same words again is the same
   thing, which moves on to the new line's place on its click (#488
   follow-up): `key` says what it is, `lead` is the index of its first line,
   and a pin's `run` numbers the pins that travel. */
function slideMapItems(kids) {
  const items = [];
  const pinOf = b => SLIDE_PIN_RE.exec(trim(slideWords(b)));
  const picOf = b => slidePicture(b.title || "");
  const words = b => trim(String(b.title || "").replace(/!\[[^\]]*\]\([^)]*\)/g, ""));
  const firsts = new Map(), runs = new Map();
  const keyed = it => {
    if (!firsts.has(it.key)) firsts.set(it.key, items.length);
    it.lead = firsts.get(it.key);
    items.push(it);
    return it;
  };
  for (let i = 0; i < kids.length; i++) {
    const b = kids[i];
    const pin = pinOf(b);
    if (pin) {
      const key = "pin " + pin[1];
      if (!runs.has(key)) runs.set(key, runs.size + 1);
      keyed({kind: "pin", block: b, lines: [], pins: [b], name: "", run: runs.get(key), key});
      continue;
    }
    const pic = picOf(b), own = (b.children || []).filter(c => !slideHidden(c));
    const mine = {block: b, lines: own.filter(c => !pinOf(c)), pins: own.filter(c => pinOf(c)), run: 0};
    if (pic && !words(b)) {
      // A card written flat: the plain lines after its picture are its own.
      if (!own.length) while (i + 1 < kids.length && !pinOf(kids[i + 1]) && !picOf(kids[i + 1])) mine.lines.push(kids[++i]);
      mine.kind = "card";
      mine.name = mine.lines[0] ? withoutMarks(slideWords(mine.lines[0])) : "";
      mine.key = "card " + pic;
    } else if (pic) {
      mine.kind = "badge";
      mine.name = withoutMarks(slideWords({title: words(b)}));
      mine.key = "badge " + pic;
    } else {
      mine.kind = "text";
      mine.key = "text " + trim(withoutMarks(slideWords(b))).toLowerCase();
    }
    keyed(mine);
  }
  return items;
}
