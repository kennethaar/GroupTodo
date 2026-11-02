function tourNoteView(view, opts = {}) {
  const id = tourOf(view, opts.sub || (view === state.view ? subNow() : defaultSub(view)), opts);
  if (id) tourMarkSeen(id);
}
