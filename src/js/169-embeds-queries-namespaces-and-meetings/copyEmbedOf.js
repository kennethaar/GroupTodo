/* The line menu's Copy as embed: the line gets an id:: if it has none, and
   what is copied pastes as a live copy of it anywhere in the area. */
function copyEmbedOf(path, block) {
  const id = ensureBlockId(path, block);
  copyText("{{embed ((" + id + "))}}", "Copied. Paste it on any line to show this one there.");
}
