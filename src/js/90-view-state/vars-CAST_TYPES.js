/* ---------- the cast (#247) ----------
   The characters are the people of the book's area: person pages, made and
   kept as People makes and keeps them, with their aliases:: and all. Those
   who use the app (member:: true) are the writers, not the cast. A place or a
   thing is a page that says type:: place or type:: thing, made from
   8/place.md and 8/thing.md, which setting up a book writes. A name, its
   aliases and, for a character, the first word of a longer name are what the
   text calls it: Anna Berg is Anna. Somebody a scene names in pov:: or with::
   who has no page yet is in the cast too, until they get one. Names are
   matched as written, so Will the man is not will the word. */
const CAST_TYPES = [["character", "Characters"], ["place", "Places"], ["thing", "Things"]];
const castType = path => {
  if (isTemplatePath(path)) return null;
  if (pageKind(path) === "person") return isMemberPage(path) ? null : "character";
  const t = trim(String(getPage(path)?.props?.type || "")).toLowerCase();
  return t === "place" || t === "thing" ? t : null;
};
/* What setting up a book writes in 8/, if it is not there: the page a new
   place or thing starts as. Edit them there to start yours another way. */
const BOOK_TEMPLATES = {
  place: {props: {title: "%title%", type: "place", aliases: "", created: "%today%"}, lines: ["What it looks like, sounds like, smells like"]},
  thing: {props: {title: "%title%", type: "thing", aliases: "", created: "%today%"}, lines: ["What it is, and who has it"]},
};
/* Words in front of a name that are not what anybody is called by. */
const NAME_TITLES = new Set(["the", "a", "an", "old", "young", "little", "big", "mr", "mr.", "mrs", "mrs.", "ms", "ms.", "miss", "dr", "dr.",
  "sir", "lady", "lord", "king", "queen", "aunt", "uncle", "father", "mother", "sister", "brother", "captain", "den", "det", "de",
  "der", "die", "das", "la", "le", "el", "gamle", "unge", "lille", "store", "fru", "herr", "frk", "tante", "onkel", "far", "mor"]);
