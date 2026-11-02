/* ---------- the mindmap's own graph ----------
   The map is about pages, so pages are all it draws. The mindmap is about
   getting somewhere, and the place you are usually getting to is a task: a
   project whose actions are invisible is a dot with a name on it, which is
   exactly the complaint. So the mindmap takes the page graph and hangs the
   tasks off it -- a page's tasks below the page, a task's sub-tasks below the
   task, and a task that names a project below that project too, wherever it
   happens to be written -- which makes "zoom in to a project" the same gesture
   as every other move on this screen.

   Done and cancelled tasks are drawn too, faintly: a project you are reviewing
   is partly a record of what you already did, and a branch that empties as you
   finish it reads as the work vanishing rather than as progress. */
function plexGraph() {
  return memo("plexGraph", () => {
    const base = graphData();
    // Copies, because degree is counted again here and the map must not see it.
    const nodes = base.nodes.map(n => Object.assign({}, n));
    const edges = base.edges.slice();
    const index = new Map();
    nodes.forEach((n, i) => index.set(n.key, i));

    const names = visibleSpaces().filter(n => LOADED.has(n));
    for (const name of (names.length ? names : [null])) {
      inSpace(name, () => {
        const space = name;
        /* A task written in today's journal under "[[1/kitchen]]" is a step of
           the kitchen project, and centring the project and seeing a bare dot
           is the complaint this answers. So a task also hangs off the project
           it names -- its own line, or the nearest bullet above it that names
           one -- as well as off the page it is written on. Both edges are
           true, and neither is a copy of anything: the link is already in the
           markdown. */
        const projectAt = text => {
          for (const raw of linksIn(text || "")) {
            const tp = findExistingPage(raw.split("][")[0]);
            if (tp && pageKind(tp) === "project") return tp;
          }
          return null;
        };
        const fanned = idx => {
          const nd = nodes[idx];
          if ((nd.fan || 0) >= CFG.plexTaskFan) { nd.more = (nd.more || 0) + 1; return true; }
          nd.fan = (nd.fan || 0) + 1;
          return false;
        };
        const link = (parentIdx, idx) => {
          if (parentIdx == null || parentIdx === idx) return;
          edges.push([parentIdx, idx]);
          nodes[parentIdx].deg++; nodes[idx].deg++;
        };
        /* ownerIdx: the page or task the bullet is written under.
           projIdx: the project named on the way down here, if any. */
        const hang = (blocks, ownerIdx, projIdx) => {
          for (const b of blocks || []) {
            const named = projectAt(b.title);
            const nIdx = named == null ? null
              : index.get((space || "") + "\u0000" + named);
            const proj = nIdx == null ? projIdx : nIdx;
            // A message is a conversation, not an action, and an untitled
            // bullet is a blank line somebody left behind.
            if (!b.state || isMessage(b)) { hang(b.children, ownerIdx, proj); continue; }
            /* The project is where this step belongs, so it is the one that
               gets the room when the fan is full; the page it is written on is
               a second home and does not keep it off the map on its own. */
            const owners = [];
            if (proj != null && proj !== ownerIdx) owners.push(proj);
            owners.push(ownerIdx);
            const room = owners.filter(o => !fanned(o));
            if (!room.length) continue;
            const path = nodes[ownerIdx].path;
            const key = (space || "") + "\u0000" + path + "\u0000#" + b.id;
            const idx = nodes.length;
            index.set(key, idx);
            nodes.push({key, space, path, block: b, blockId: b.id, task: true,
                        kind: b.state, state: b.state,
                        label: plainTitle(b.title) || "(untitled)", deg: 0});
            room.forEach(o => link(o, idx));
            /* Sub-tasks hang off the task and stop there: a step of a step
               is not a step of the project, and drawing it as one puts the
               whole tree in one fan. One that names a project itself still
               goes there. */
            hang(b.children, idx, null);
          }
        };
        for (const [path, page] of V.pages) {
          const pi = index.get((space || "") + "\u0000" + path);
          if (pi == null) continue;            // not drawn: capped, or a kind we skip
          hang(page.blocks, pi, pageKind(path) === "project" ? pi : null);
        }
      });
    }
    return {nodes, edges, dropped: base.dropped};
  });
}
