/* A page's parents: the pages whose children:: name it. Worked out once per
   area until something changes. */
function parentsOfPage(space, path) {
  return inSpace(space, () => memo("parents:" + V.space, () => {
    const up = new Map();
    for (const p of allPages()) {
      const props = getPage(p)?.props || {};
      for (const ref of linksIn(props.children || props.parent_of || "")) {
        const target = trim(String(ref).split("][")[0].split("|")[0]);
        if (target.includes("#^")) continue;        // a task as a child, not a page
        const child = findExistingPage(target);
        if (child && child !== p) { if (!up.has(child)) up.set(child, []); up.get(child).push(p); }
      }
    }
    return up;
  }).get(path) || []);
}
