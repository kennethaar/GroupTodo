/* The rooms, unfolded under Chores: each one opens Chores narrowed to it, the
   same pick as its chip there. Its count is what is due now for you, as on
   Chores itself, most first; Rest of home comes last among equals. */
function navChores() {
  const all = choreRows(), at = state.view === "chores" ? PREF.get("chores.room", "") : null;
  const rooms = [...new Set(all.map(a => choreRoom(a.context)))].map(k => [k,
    k === "@" ? "Rest of home" : k.split("/").slice(1).join("/"),
    all.filter(a => choreRoom(a.context) === k && a.mine && choreGroup(a) === "due").length]);
  rooms.sort((x, y) => y[2] - x[2] || (x[0] === "@") - (y[0] === "@") || x[1].localeCompare(y[1]));
  return rooms.map(([k, label, n]) => el("button", {
    class: "nav-item small nav-sub" + (at === k ? " active" : ""),
    "aria-current": at === k ? "page" : null,
    title: k === "@" ? "Chores at @home in no room" : "The chores in " + label,
    onclick: () => { PREF.set("chores.room", k); go("chores"); },
  },
    el("span", {class: "ic bw"}, (k !== "@" && contextIcon(k.slice(1))) || "@"),
    el("span", {class: "lbl"}, label),
    n ? el("span", {class: "cnt"}, String(n)) : null));
}
