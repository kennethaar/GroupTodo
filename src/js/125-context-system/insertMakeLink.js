/* One link, added to the line rather than replacing it -- except when the line
   says nothing but the name, where a line and a link to itself would be the
   same words twice. The page behind the link is made by createLinkedPages,
   which is the same thing that happens when somebody types the link by hand. */
function insertMakeLink(path, block, ref) {
  const already = linksIn(block.title).some(l => trim(l).toLowerCase() === ref.toLowerCase());
  if (already) { notify("That link is already on this line."); return; }
  const name = trim(ref.split("/").slice(1).join("/"));
  const bare = bareLineName(block);
  // The name was made from the line's words, so they are compared the same way:
  // "Plan: shed" is the page "Plan- shed", and its words become the link's text
  // rather than staying in front of it (#369).
  const only = bare && slugify(bare).toLowerCase() === name.toLowerCase();
  const link = "[[" + ref + (only && bare !== name ? "][" + bare : "") + "]]";
  if (only) {
    /* The whole line becoming a project is the todo turning into one: the
       project carries the status now, so the TODO comes off the line -- the
       way back, projectLineToTask, puts it on again (#234). */
    const proj = !!STATUS_DIRS[ref.split("/")[0]];
    const [st] = splitState(block.title);
    block.title = trim((st && !proj ? st + " " : "") + link);
    if (proj && block.state) {
      if (block.state === "DOING") clockOut(block);
      block.state = null;
    }
  } else {
    block.title = trim(block.title) + " " + link;
  }
  createLinkedPages(block.title);
  touch(path);
  render();
}
