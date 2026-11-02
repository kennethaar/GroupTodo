/* "Ann Berg <ann@x.no>", "Ann Berg [mailto:ann@x.no]", "ann@x.no", "Ann Berg" */
function mailSender(s) {
  s = trim(s);
  const m = /^"?(.*?)"?\s*[<\[](?:mailto:)?([^>\]\s]+@[^>\]\s]+)[>\]]\s*$/i.exec(s);
  if (m) return {name: trim(m[1]) || m[2], email: m[2]};
  if (looksLikeEmail(s)) return {name: s, email: s};
  return {name: s, email: ""};
}
