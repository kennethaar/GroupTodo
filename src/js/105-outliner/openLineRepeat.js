/* The Repeats dialog for one line: from its ↻ chip, Alt+R or Custom… */
function openLineRepeat(path, block) {
  openRecurrenceDialog({title: "Repeats", spec: repeatOf(block), onSave: ({spec}) => {
    flyMakeTask(path, block);
    if (spec) setBlockProp(block, REPEAT_PROP, spec);
    else for (const key of Object.keys(block.props)) if (key.toLowerCase() === REPEAT_PROP) delete block.props[key];
    touch(path); render();
  }});
}
