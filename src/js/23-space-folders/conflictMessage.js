function conflictMessage(name, c) {
  if (c.how === "same")
    return `That folder already holds ${c.space}. Two areas in one folder would put them in the same place - share it and you share both. Pick a different folder for ${name}.`;
  if (c.how === "inside")
    return `That folder is inside ${c.space}'s folder. ${c.space} reads everything beneath it, so it would swallow ${name}. Pick a folder outside it.`;
  return `That folder contains ${c.space}'s folder. ${name} would read and sync ${c.space}'s files as its own. Pick a folder that does not contain it.`;
}
