function openTodoCount(path) {
  const page = getPage(path); if (!page) return 0;
  return flattenBlocks(page.blocks).filter(b => OPEN_STATES[b.state]).length;
}
