/* Not a layout it knows: the first line is the subject, the next one who
   sent it, and the rest the words -- all of it put right on the page. */
function mailFromLines(raw) {
  const lines = String(raw || "").replace(/\r\n?/g, "\n").split("\n").map(trim).filter(Boolean);
  const who = mailSender(lines[1] || "");
  return {subject: lines[0] || "", name: who.name, email: who.email, to: "", sent: "", body: lines.slice(2)};
}
