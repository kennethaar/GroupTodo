// The Journal's Week is a sub-view of its own, though the Journal has no tabs.
const helpSubHere = () => SUBS[state.view] ? subNow() : state.view === "today" && state.sub === "week" ? "week" : null;
const helpTopicHere = () => helpTopicOf(state.view, helpSubHere());
// The topic in the pane: the screen's own, or one read beside it.
const helpPaneTopic = () => HELP_SIDE === "page" ? helpTopicHere() : HELP[HELP_SIDE] ? HELP_SIDE : null;
// Whether what a topic names can be on screen now: it is about this screen, or about no one screen.
const helpOnScreen = id => !!HELP[id] && (!HELP[id].view || (HELP[id].view === state.view &&
  (!HELP[id].sub || HELP[id].sub === helpSubHere())));
const helpAll = t => [t.title, t.what, t.hint, ...(t.steps || []).map(s => [].concat(s)[0]),
  ...(t.legend || []).map(l => l[1]), ...(t.more || []), ...(t.keys || []).flat(), ...(t.code || []).flat()].filter(Boolean);
