/* The line starts with the verb from now on, unless it already starts with one. */
function prependVerb(path, block, word) {
  const verb = capitalise(trim(word));
  if (!startsWithVerb(block.title)) block.title = verb + " " + block.title;
  if (!block.state) block.state = "TODO";
  touch(path);
}
