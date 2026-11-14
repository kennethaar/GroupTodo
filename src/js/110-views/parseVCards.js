/* The people in a .vcf file, as phones and Outlook write it: folded lines,
   grouped and typed keys, quoted-printable, vCard 2.1 to 4.0 (#383). Each
   comes back as {name, phone, email, org, birthday}; the birthday is written
   the way birthday:: is, 1985-03-14 or 03-14 without a year. */
function parseVCards(text) {
  const out = [];
  let card = null;
  const lines = String(text || "").replace(/\r\n?/g, "\n")
    .replace(/=\n/g, "=\u0000")          // a quoted-printable soft break
    .replace(/\n[ \t]/g, "").replace(/=\u0000/g, "=\n").split("\n");
  const unesc = s => s.replace(/\\([\\,;nN])/g, (m, c) => c === "n" || c === "N" ? "\n" : c);
  const parts = s => s.split(/(?<!\\);/).map(x => trim(unesc(x)));
  const qp = s => {
    const bytes = [];
    const raw = s.replace(/=\n/g, "");
    for (let i = 0; i < raw.length; i++) {
      if (raw[i] === "=" && /^[0-9A-F]{2}$/i.test(raw.slice(i + 1, i + 3))) { bytes.push(parseInt(raw.slice(i + 1, i + 3), 16)); i += 2; }
      else bytes.push(...new TextEncoder().encode(raw[i]));
    }
    return new TextDecoder().decode(new Uint8Array(bytes));
  };
  const day = v => {
    const m = /^(?:(\d{4})|--)-?(\d{2})-?(\d{2})/.exec(trim(v));
    return m ? (m[1] ? m[1] + "-" : "") + m[2] + "-" + m[3] : "";
  };
  for (const line of lines) {
    const m = /^(?:[\w-]+\.)?([A-Za-z-]+)((?:;[^:]*)?):(.*)$/s.exec(line);
    if (!m) continue;
    const key = m[1].toUpperCase(), params = m[2].toUpperCase();
    let value = m[3];
    if (/QUOTED-PRINTABLE/.test(params)) value = qp(value);
    if (key === "BEGIN" && /^vcard$/i.test(trim(value))) { card = {name: "", n: "", phone: [], email: [], org: "", birthday: ""}; continue; }
    if (!card) continue;
    if (key === "END") {
      card.name = trim(card.name || card.n);
      delete card.n;
      if (card.name) out.push(card);
      card = null;
    } else if (key === "FN") card.name = trim(unesc(value));
    else if (key === "N") { const [family, given] = parts(value); card.n = [given, family].filter(Boolean).join(" "); }
    else if (key === "TEL") { const t = trim(unesc(value).replace(/^tel:/i, "")); if (t) card.phone.push(t); }
    else if (key === "EMAIL") { const e = trim(unesc(value).replace(/^mailto:/i, "")); if (e) card.email.push(e); }
    else if (key === "ORG") card.org = parts(value)[0] || "";
    else if (key === "BDAY") card.birthday = day(value);
  }
  return out;
}
