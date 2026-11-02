function promptNewMake(path, block, kindKey) {
  const spec = MAKE_KINDS[kindKey];
  promptInput({
    title: spec.label, label: "Name", value: bareLineName(block), cta: "Link it",
    onSave: name => {
      if (kindKey === "project") {
        createProjectFlow(name, p => insertMakeLink(path, block, pageRef(p)));
        return;
      }
      insertMakeLink(path, block, KIND_PREFIX[kindKey] + slugify(name));
    },
  });
}
