const lineSelText = () => {
  const got = lineSelBlocks();
  return got ? serializeBlocks(got.blocks) : "";
};
