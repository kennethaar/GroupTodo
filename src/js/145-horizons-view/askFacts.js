/* When it was last asked and what they last said, in the ask's language, so
   they need not repeat old news and can see it has been a while without being
   told so (#344). Nothing on a first ask. */
function askFacts(block, name) {
  const t = ASK_NOTE[askLang()] || ASK_NOTE.en;
  const asked = askedAt(block);
  const last = messagesOf(block).filter(m => samePerson(msgAuthor(m), name)).pop();
  const parts = [];
  if (asked) parts.push(t.askedW + " " + asked);
  if (last) parts.push(t.heardW + " " + msgAt(last).slice(0, 10) + ": “" + mailCut(plainTitle(last.title), 90) + "”");
  else if (asked) parts.push(t.noneW);
  const line = parts.join(" · ");
  return line ? line.charAt(0).toUpperCase() + line.slice(1) : "";
}
