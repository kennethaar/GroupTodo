function keepDarling(block, props) {
  for (const [k, v] of Object.entries(props)) if (v) setBlockProp(block, k, v);
  darlingsPage().blocks.unshift(block);
  touch(DARLINGS_PATH);
}
