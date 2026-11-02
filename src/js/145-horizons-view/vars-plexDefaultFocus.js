/* ---------- the plex screen ----------
   Two ways of looking at the same links, and the toggle says which: the map is
   the whole vault at once, the plex is one page and its neighbours. Neither is
   a different file format. */
const plexDefaultFocus = g => {
  if (state.graphFocus && g.nodes.some(n => n.key === state.graphFocus)) return state.graphFocus;
  const best = g.nodes.slice().sort((a, b) => b.deg - a.deg || a.label.localeCompare(b.label))[0];
  return best ? best.key : null;
};
