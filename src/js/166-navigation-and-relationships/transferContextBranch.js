/* A context and everything nested under it, into another area: moved, or
   left behind and copied, with {into} nesting it under a context already
   there. Areas are separate vaults, so this is a file transfer first (as
   any page gets, dragged to another area) and a reparent second, reusing
   the same nest/unnest a same-area drag already does. */
async function transferContextBranch(space, name, target, {mode = "move", into = ""} = {}) {
  if (target === space) return;
  const branch = inSpace(space, () => contextList()).filter(n => n === name || n.startsWith(name + "/"));
  for (const n of branch) inSpace(space, () => {
    const p = contextPath(n);
    if (!V.pages.has(p)) putPage(p, pageTemplateFor("c", n));
  });
  const ok = await copyPagesToSpace(branch.map(path => ({path: contextPath(path), from: space})), target, {mode});
  if (ok !== true) return;
  if (into) {
    inSpace(target, () => { if (!V.pages.has(contextPath(into))) putPage(contextPath(into), pageTemplateFor("c", into)); });
    nestContext({path: contextPath(into), space: target}, {path: contextPath(name), space: target});
  } else if (name.includes("/")) {
    unnestContext({path: contextPath(name), space: target});
  }
}
