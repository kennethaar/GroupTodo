/* The questions a page transfer asks -- what comes along, move, copy or sync,
   and what to do about a file already there -- as fields for any dialog.
   key keeps the radios of two of them on one dialog apart. */
function boundedTransferFields(plan, target, opts, key = "bounded") {
  let mode = opts.mode || (opts.copy ? "copy" : "sync");
  const selected = new Set();
  const body = el("div", {class: "field"},
    el("p", {}, plan.space + " → " + target),
    el("p", {}, "Main file: " + plan.path),
    el("p", {}, "Only journal lines that link straight to the main file come along, with their children. " +
                "Whole journal pages are never moved."),
    el("div", {class: "space-transfer-list"},
      plan.branches.map(b => el("div", {}, b.path + " : " + plainTitle(b.title)))));
  if (plan.files.length) {
    body.append(el("p", {}, "Pages the main file links to directly. None comes along unless you tick it, " +
                            "and their own links are not followed."));
    for (const path of plan.files) {
      const exists = LOADED.get(target)?.pages.has(path);
      const box = el("input", {type: "checkbox", disabled: exists,
        onchange: e => { if (e.target.checked) selected.add(path); else selected.delete(path); }});
      body.append(el("label", {class: "space-transfer-choice"}, box,
        " " + path + (exists ? " (already in the target area, left as it is)" : "")));
    }
  }
  body.append(...radioChoices(key + "-mode", TRANSFER_MODES, mode, v => { mode = v; }));
  /* The same file already in the target -- an earlier copy, or a project of
     the same name -- used to stop the move dead. Now you say what happens. */
  const there = LOADED.get(target)?.pages.get(plan.path);
  const twin = there && there.props?.space_sync_id &&
               there.props.space_sync_id === inSpace(plan.space, () => getPage(plan.path))?.props?.space_sync_id;
  let clash = there && !twin ? "merge" : null;
  if (clash) body.append(el("p", {}, plan.path + " is already in " + target + ". What should happen to it?"),
    ...radioChoices(key + "-clash", [["merge", "Merge: keep its lines and add these under them"],
                                     ["replace", "Replace it with this one"]], clash, v => { clash = v; }));
  return {body, collect: () => ({mode, files: [...selected], clash})};
}
