/* The page a line is on now, by its id. */
const pathOfBlock = (block, fallback) => findBlock(block.id)?.path || fallback;
