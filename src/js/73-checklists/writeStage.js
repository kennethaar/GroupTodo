function writeStage(block, list, name) {
  block.props = block.props || {};
  if (!list) { for (const k of Object.keys(block.props)) if (k.toLowerCase() === "stage") delete block.props[k]; return; }
  setBlockProp(block, "stage", "[[" + pageRef(list) + "]]" + (name ? " " + name : ""));
}
