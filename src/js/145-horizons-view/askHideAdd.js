/* One more name for Hidden names. */
function askHideAdd(name) {
  name = trim(name || "");
  if (!name || askHideNames().some(n => n.toLowerCase() === name.toLowerCase())) return;
  getPage(askHideEnsure()).blocks.push(newBlock({state: null, title: name}));
  touch(ASK_HIDE_PATH);
}
