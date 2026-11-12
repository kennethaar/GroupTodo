/* Pick what it belongs to, or make it out of the words already on the line.
   The line's own name comes first in the list, because nine times in ten that
   is the answer -- and it is the one choice that needs no typing at all. */
function openMakeLinkPicker(path, block, kindKey) {
  const spec = MAKE_KINDS[kindKey];
  const pfx = KIND_PREFIX[kindKey];
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
      createProjectFlow(it.label, p => insertMakeLink(path, block, pageRef(p)), {notes: () => lineNotes(path, block)});
      return;
    }
    insertMakeLink(path, block, it.ref);
  };
  if (!items.length) { promptNewMake(path, block, kindKey); return; }
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
      onclick: () => { closeModal(); promptNewMake(path, block, kindKey); }}, "+ another name"),
  });
}
