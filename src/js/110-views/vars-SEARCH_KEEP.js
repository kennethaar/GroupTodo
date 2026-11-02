const SEARCH_KEEP = {
  all:      () => true,
  projects: h => !h.block && h.kind === "project",
  todos:    h => !!h.todo,
};
