function contextKids(r) {
  return inSpace(r.space, () => {
    const dir = r.path.replace(/\.md$/i, "") + "/";
    const kids = allPages(p => p.startsWith(dir) && !p.slice(dir.length).includes("/")).map(path => ({path, space: V.space}));
    for (const ref of linksIn(relProps(r).children || relProps(r).parent_of || "")) {
      const x = relResolve(ref, r.space);
      if (x && !x.block && isContextPath(x.path) && x.path !== r.path && !kids.some(k => k.path === x.path)) kids.push(x);
    }
    return kids;
  });
}
