/* The line menu's Copy as plain text: the state and the words as they read in
   the app, without brackets, #tags, properties or the lines below. */
function plainLineText(block) {
  const words = plainTitle(block.title).replace(/(^|\s)#[^\s#]+/g, "$1").replace(/\s{2,}/g, " ").trim();
  return (block.state ? block.state + " " : "") + words;
}

function copyPlainOf(block) {
  copyText(plainLineText(block), "Copied as plain text.");
}
