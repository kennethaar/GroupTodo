/* ---------- what is a child of what ----------
   children:: on a page or a task lists what it is made of. It is a separate
   idea from depends_on::, which says what has to finish first: a phase of a
   project is its child, the permit the phase waits for is its dependency.
   A row here is a page or a task, in its own space; relId names one. */
const REL_SEARCH = Object.create(null);
const REL_FILTER = Object.create(null);
const relId = r => JSON.stringify([r.space || V.space, r.path, r.block ? r.block.id : null]);
const relRef = r => inSpace(r.space, () => pageRef(r.path)) + (r.block ? "#^" + r.block.id : "");
const relChildrenRaw = r => inSpace(r.space, () => relProps(r).children || relProps(r).parent_of || "");
