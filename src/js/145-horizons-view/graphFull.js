/* Every page and every link, uncapped. The map filters this before it caps,
   so hiding the day pages makes room for more of everything else. */
function graphFull() {
  return memo("graphFull", () => {
    const nodes = [], edges = [], index = new Map();
    const keyOf = (space, path) => (space || "") + "\u0000" + path;
    const skip = k => k === "verb";
    const add = (space, path) => {
      const k = keyOf(space, path);
      let i = index.get(k);
      if (i == null) {
        i = nodes.length;
        index.set(k, i);
        const kind = pageKind(path);
        const props = getPage(path)?.props || {};
        nodes.push({key: k, space, path, kind,
                    // When it came into the vault, for watching the map grow.
                    born: isJournalPath(path) ? journalDate(path) || "" : dateIn(props.created || props.added || "") || "",
                    // A context reads as @phone everywhere else in the app.
                    label: kind === "context" ? "@" + pageTitle(path) : pageTitle(path), deg: 0});
      }
      return i;
    };
    /* A link to a page nobody has opened yet is still a link: [[c/phone]] is
       written in fifty tasks long before anything creates pages/c/phone.md.
       Leaving those out would hide most of the structure, so they are drawn
       hollow, and clicking one creates the page exactly as clicking the link
       in a task does. */
    const ghostKind = {c: "context", p: "person", o: "org", z: "zettel"};
    const addGhost = (space, ref) => {
      const k = keyOf(space, "\u0000ghost\u0000" + ref.toLowerCase());
      let i = index.get(k);
      if (i == null) {
        const pfx = (/^([^/]+)\//.exec(ref) || [])[1];
        const known = ghostKind[pfx] || (pfx && STATUS_DIRS[pfx] ? "project" : null);
        const bare = known ? ref.slice(pfx.length + 1) : ref;
        i = nodes.length;
        index.set(k, i);
        nodes.push({key: k, space, ref, ghost: true, kind: known || "page",
                    label: pfx === "c" ? "@" + bare : bare, deg: 0});
      }
      return i;
    };
    const names = visibleSpaces().filter(n => LOADED.has(n));
    for (const name of (names.length ? names : [null])) {
      inSpace(name, () => {
        const space = name;
        const pairs = new Set();
        for (const [path, page] of V.pages) {
          if (skip(pageKind(path))) continue;
          const from = add(space, path);
          /* A page's values are links too -- area:: [[a/Home]] is the strongest
             tie a project has -- except the stamps, which only say when. */
          const own = Object.entries(page.props || {})
            .filter(([k]) => !/^(title|created|updated|updated_by|reviewed|last_seen|template_source)$/i.test(k))
            .map(([, v]) => String(v)).join("\n");
          const lines = [{title: own}];
          walkBlocks(page.blocks, b => { if (!isMessage(b)) lines.push(b); });
          for (const b of lines) {
            const text = [b.title, ...(b.body || [])].join("\n");
            for (const raw of linksIn(text)) {
              const target = raw.split("][")[0];
              if (/^go\//.test(target)) continue;            // tour doors are not pages
              if (/%\w+%/.test(target)) continue;            // a stencil's hole, filled in when it is used
              const tp = findExistingPage(target);
              if (tp && (tp === path || skip(pageKind(tp)))) continue;
              if (!tp && /^\d{4}-\d{2}-\d{2}$/.test(target)) continue;   // a day nobody wrote in
              const to = tp ? add(space, tp) : addGhost(space, target);
              const pk = from < to ? from + ":" + to : to + ":" + from;
              if (pairs.has(pk)) continue;
              pairs.add(pk);
              edges.push([from, to]);
              nodes[from].deg++; nodes[to].deg++;
            }
          }
        }
      });
    }

    /* A page is part of the vault from the first time anything mentions it,
       which is often long before its file says it was created: a link to a
       page nobody has made has no date at all, and a template update stamps
       created:: with the day it ran. So a page arrives with the oldest page
       linking it, when that is older than its own date. One step only, from
       the pages' own dates, or one old page would date its whole cluster. */
    const own = nodes.map(nd => nd.born || "");
    for (const [a, b] of edges) {
      if (own[a] && (!nodes[b].born || own[a] < nodes[b].born)) nodes[b].born = own[a];
      if (own[b] && (!nodes[a].born || own[b] < nodes[a].born)) nodes[a].born = own[b];
    }
    return {nodes, edges};
  });
}
