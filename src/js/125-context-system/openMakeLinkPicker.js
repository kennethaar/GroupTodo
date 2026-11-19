/* Pick what it belongs to, or make it out of the words already on the line.
   The line's own name comes first in the list, because nine times in ten that
   is the answer -- and it is the one choice that needs no typing at all.
   It links in the area it was opened in, and then() runs once the link is on
   the line (#439): Review actions deals its next card then. */
function openMakeLinkPicker(path, block, kindKey, then = null) {
  const spec = MAKE_KINDS[kindKey];
  const pfx = KIND_PREFIX[kindKey];
  const sp = V.space;
  const here = fn => holdRender(() => inSpace(sp, fn));
  const link = ref => { here(() => insertMakeLink(path, block, ref)); if (then) then(); else render(); };
  const bare = bareLineName(block);
  const existing = linkAlternatives(spec.kind)
    .map(([ref, label]) => ({ref, label}))
    .filter(r => r.ref.toLowerCase() !== (pfx + bare).toLowerCase());
  const fresh = name => ({ref: pfx + slugify(name), label: name, isNew: true});
  const items = (bare ? [fresh(bare)] : []).concat(existing);
  const run = it => {
    if (it.isNew && kindKey === "project") {
      /* A project is the one of the five that is more than a page: it wants an
         outcome and a next action, and that is createProjectFlow's job. */
      here(() => createProjectFlow(it.label, p => link(pageRef(p)), {notes: () => lineNotes(path, block)}));
      return;
    }
    link(it.ref);
  };
  if (!items.length) { promptNewMake(path, block, kindKey, link); return; }
  listPicker({
    title: spec.label,
    hint: bare ? "“" + bare + "”" : "",
    items, typeahead: true,
    // A project is named with the notes it comes from in view (#368).
    note: kindKey === "project" ? lineNotes(path, block) : null,
    label: it => (it.isNew ? "Make " + (spec.noun || "page") + " “" + it.label + "”" : it.label),
    detail: it => (it.isNew ? "from this line" : it.ref),
    onPick: run,
    footer: el("button", {class: "btn ghost",
      onclick: () => { closeModal(); promptNewMake(path, block, kindKey, link); }}, "+ another name"),
  });
}
