/* ---------- the map ----------
   The whole vault at once is a hairball, and a hairball answers nothing. So the
   map takes sides:

   - Day pages are off until you ask. A day mentions everything you touched
     that day, so with them on, every page is two steps from every other and
     the clusters you came to see melt into one.
   - Pages with no links at all are off the picture too. They are a list, not
     a shape, and they are listed beside it as the thing worth doing something
     about.
   - A click picks a page rather than leaving the screen: its neighbours light
     up, the rest fades, and the panel says what it is, what it links to and
     what links to it, with the ways out of here. Double-click opens it.
   - Nothing picked, the panel says what the picture means: the hubs, the
     links to pages nobody has made yet, and the pages nothing links to.
   - "Around it" cuts the map down to one or two steps from the picked page,
     which is the question most people bring to a graph. */
const MAP = {sel: null, q: "", key: null};
const MAP_DEPTHS = [["all", "Everything"], ["1", "1 step"], ["2", "2 steps"]];

/* How many pages the map draws: the best-connected first, with more one
   click away. A big vault takes a moment to settle, which is a fair price for
   seeing all of it; 0 is no limit. */
/* The map starts on the thinking: notes and the pages that are no other kind.
   Every other kind is a chip away. */
const MAP_HIDE_DEFAULT = ["project", "person", "org", "context", "area", "goal", "checklist", "journal", "horizon", "verb", "email"].join(",");
const mapCap = () => { const v = PREF.get("map.cap", "all"); return v === "all" ? 0 : Number(v) || CFG.graphStep; };
