/* One person as a vCard 3.0, which iPhone, Android and Outlook all read
   (#383). Lines end in CRLF, as the format asks. */
function personVCard(path) {
  const c = vcardOfPerson(path);
  const esc = s => String(s).replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/[,;]/g, m => "\\" + m);
  const words = trim(c.name).split(/\s+/);
  const family = words.length > 1 ? words.pop() : "";
  const b = parseBirthday(c.birthday);
  const pad = n => String(n).padStart(2, "0");
  const lines = ["BEGIN:VCARD", "VERSION:3.0",
    "N:" + esc(family) + ";" + esc(words.join(" ")) + ";;;", "FN:" + esc(c.name),
    ...c.phone.map(p => "TEL;TYPE=CELL:" + esc(p)),
    ...c.email.map(e => "EMAIL;TYPE=INTERNET:" + esc(e)),
    c.org ? "ORG:" + esc(c.org) : null,
    b ? "BDAY:" + (b.year ? b.year + "-" : "--") + pad(b.month) + "-" + pad(b.day) : null,
    "END:VCARD"];
  return lines.filter(Boolean).join("\r\n") + "\r\n";
}
