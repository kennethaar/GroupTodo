function boardSelActions() {
  const items = boardSelItems();
  if (!items.length) return [];

  if (BOARD_SEL.kind === "task") return [
    {label: "+ person", hint: "Hand all of them to somebody",
      run: () => pickName({title: "Hand these to", items: allPersonNames(), prefix: "p",
        onPick: who => boardSelApply(items, "Handed to " + who, x => {
          const a = x.action;
          return inSpace(a.space, () => {
            const prev = assigneeOf(a.block);
            if (samePerson(prev, who)) return null;
            assignBlock(a.path, a.block, who);
            return () => inSpace(a.space, () => assignBlock(a.path, a.block, prev || whoAmI()));
          });
        })})},
    {label: "+ context", hint: "The place or tool all of them need",
      run: () => pickName({title: "Context for these", items: allContextNames(), prefix: "c",
        onPick: ctx => boardSelApply(items, "Put in @" + ctx, x => {
          const a = x.action;
          if (inSpace(a.space, () => hasContextLink(a.block.title))) return null;
          return blockLinkAdd(a, "c/" + ctx);
        })})},
    {label: "+ project", hint: "Make all of them steps in one project",
      run: () => pickProject({title: "Put these under", onPick: r => {
        const mine = items.filter(x => (x.action.space || V.space) === r.space);
        if (mine.length < items.length) {
          notify((items.length - mine.length) + " of them live in another area, so they " +
                 "cannot point at that project.", "warn");
        }
        boardSelApply(mine, "Filed under " + rowTitle(r),
          x => blockLinkAdd(x.action, pageRef(r.path)));
      }})},
  ];

  if (BOARD_SEL.kind === "project") return [
    {label: "+ organisation", hint: "Whose work this is - a client, an employer, a club",
      run: () => pickName({title: "Organisation", items: allOrgNames(), prefix: "o",
        onPick: org => boardSelApply(items, "Filed under " + org, x => inSpace(x.project.space,
          () => pageLinkPropAdd(x.project.path, "org", "o/" + trim(org), {single: true})))})},
    {label: "+ person", hint: "Somebody who is in all of them",
      run: () => pickName({title: "Person", items: allPersonNames(), prefix: "p",
        onPick: who => boardSelApply(items, who + " added", x => inSpace(x.project.space,
          () => pageLinkPropAdd(x.project.path, "with", "p/" + trim(who))))})},
    {label: "+ context", hint: "Where this work gets done",
      run: () => pickName({title: "Context", items: allContextNames(), prefix: "c",
        onPick: ctx => boardSelApply(items, "Put in @" + ctx, x => inSpace(x.project.space,
          () => pageLinkPropAdd(x.project.path, "context", "c/" + ctx, {single: true})))})},
    {label: "+ parent project", hint: "The bigger piece of work all of them belong to",
      run: () => pickProject({title: "Parent project",
        exclude: items.map(x => ({path: x.project.path, space: x.project.space})),
        onPick: r => {
          const mine = items.filter(x => (x.project.space || V.space) === r.space);
          if (mine.length < items.length) {
            notify((items.length - mine.length) + " of them live in another area, so they " +
                   "cannot point at that project.", "warn");
          }
          boardSelApply(mine, "Under " + rowTitle(r),
            x => inSpace(x.project.space,
              () => pageLinkPropAdd(x.project.path, "parent", pageRef(r.path), {single: true})));
        }})},
  ];

  return [];
}
