function promptAndInsertContext(path, block) {
  openContextPicker("Pick a context for this action", ctx => {
    insertContextLink(path, block, ctx);
    checkProjectCompletion(path);
  });
}
