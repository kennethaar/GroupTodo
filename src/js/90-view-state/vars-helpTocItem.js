const helpTocItem = (h, now) => el("li", {}, el("button", {class: "helptocitem", "aria-current": h === now ? "page" : null,
  onclick: () => openHelp(h)}, HELP[h].title));

/* ---------- "This page", at the right ----------
   ? opens the topic of the screen you are on in the pane pages open in, and
   it follows you from view to view while it is open. A topic picked from it
   is read there too, beside the app. */
let HELP_SIDE = null;     // null, "page" for the screen you are on, or a topic id
const helpOpen = () => !!HELP_SIDE;
