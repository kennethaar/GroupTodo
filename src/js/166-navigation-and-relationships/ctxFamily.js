/* A context and every one inside it, by name: its folder and what its
   children:: names, and theirs in turn, in every area on screen. */
function ctxFamily(ctx) {
  return memo("ctxFamily" + ctx, () => {
    const out = new Set([ctx]), todo = [ctx];
    while (todo.length) {
      const k = todo.pop();
      for (const space of visibleSpaces()) {
        if (!LOADED.has(space) || !inSpace(space, () => V.pages.has(contextPath(k)))) continue;
        for (const r of contextKids({path: contextPath(k), space})) {
          const n = r.path.slice(DIRS.contexts.length + 1).replace(/\.md$/i, "");
          if (!out.has(n)) { out.add(n); todo.push(n); }
        }
      }
    }
    return out;
  });
}
