/* The line menu's Copy as plain text: the state and the words as they read in
   the app, without brackets, #tags, properties or the lines below. The
   Shift+Enter box under the line comes along as written, without its fence
   (#392). */
function plainLineText(block) {
  const words = plainTitle(block.title).replace(/(^|\s)#[^\s#]+/g, "$1").replace(/\s{2,}/g, " ").trim();
  const out = [(block.state ? block.state + " " : "") + words];
  // Found as outlineBlock draws it: a fence the bullet opens is no box (#374).
  const body = block.body || [], fence = l => (/^\s*```/).test(l);
  if (!fence(block.title || "")) for (let i = 0; i < body.length; i++) {
    const end = fence(body[i]) ? body.findIndex((l, k) => k > i && fence(l)) : -1;
    if (end > i) { out.push(...body.slice(i + 1, end)); i = end; }
  }
  return out.join("\n");
}

function copyPlainOf(block) {
  copyText(plainLineText(block), "Copied as plain text.");
}
