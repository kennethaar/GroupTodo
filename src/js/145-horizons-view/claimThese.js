function claimThese(items, me) {
  for (const it of items) {
    setBlockProp(it.block, ASSIGN_PROP, me);
    if (it.block.state === "WAIT") it.block.state = "TODO";   // you can act on it now
    touch(it.path);
  }
  render();
  notify(items.length + (items.length === 1 ? " task is" : " tasks are") +
         " yours now. Still in their Waiting for - they wrote it, you own it.");
}
