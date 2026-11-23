/* ▸ Continue: <place> on top of the Journal (#492), while it is offered.
   Worked out on each draw, so a folder read after the start still offers
   its place. Says which device kept it, and when. */
function lastPlaceBar() {
  if (LAST_PLACE_OFFER === null || state.view !== "today") return null;
  const o = LAST_PLACE_OFFER = lastPlaceBest() || true;
  if (o === true) return null;
  const p = o.place;
  let name = p.view === "page" && p.pagePath ? inSpace(o.space, () => pageTitle(p.pagePath)) : VIEW_TITLE[p.view] || p.view;
  if (o.space && o.space !== V.space) name += " · " + o.space;
  const at = new Date(o.at), today = at.toDateString() === new Date().toDateString();
  const when = today ? at.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})
    : at.toLocaleDateString([], {day: "numeric", month: "short"}) + " " + at.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"});
  return el("div", {class: "lastplace", role: "region", "aria-label": "Where you left off"},
    el("button", {class: "lastgo", type: "button", onclick: lastPlaceGo}, "▸ Continue: " + name),
    el("span", {class: "lastfrom"}, " (" + (o.from || "another device") + ", " + when + ")"));
}
