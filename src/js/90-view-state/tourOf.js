function tourOf(view, sub, opts = {}) {
  if (view === "projects") return (opts.statusCode || state.statusCode) === "1" ? "projects" : null;
  if (view === "next") return sub === "calendar" ? "agenda" : "todos";
  return TOUR_OF_VIEW[view] || null;
}
