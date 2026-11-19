/* link(ref), when given, puts the link on the line instead (#439): the make
   picker passes its own, which keeps the area and says when it is done. */
function promptNewMake(path, block, kindKey, link = null) {
  const spec = MAKE_KINDS[kindKey];
  const sp = V.space;
  const put = link || (ref => insertMakeLink(path, block, ref));
  promptInput({
    title: spec.label, label: "Name", value: bareLineName(block), cta: "Link it",
    onSave: name => {
      if (kindKey === "project") {
        holdRender(() => inSpace(sp, () => createProjectFlow(name, p => put(pageRef(p)))));
        return;
      }
      put(KIND_PREFIX[kindKey] + slugify(name));
    },
  });
}
