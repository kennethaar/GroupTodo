/* ---------- names, linked once they are written out ----------
   A name you typed in full is the page you meant. Several words are matched
   whatever their case; a single word only exactly as the page spells it and
   at three letters or more, so "office" in a sentence stays a word while
   "Nordlys" becomes the client. Contexts are left alone: they are ordinary
   words, and they link when you pick them.

   A first name or an alias is not linked on its own. "John" is any John, and
   the page with aliases:: John is only one of them; linking it unasked put
   other people's Johns on his page. They are offered as you type, and Tab
   takes the one you mean.

   `before` is what the line said until now. A name it already had as plain
   words stays plain: you took the link off, or never wanted it, and writing
   something else on the line is no reason to put it back. */
function linkKnownNames(text, before = "", pool = nameIndex()) {
  const src = String(text || "");
  if (!src) return src;
  // A responsibility is offered as you type, never linked unasked: Health and
  // Home are words in a sentence far more often than the page. A plain page
  // is only offered too.
  const names = pool.filter(n => n.kind !== "context" && n.kind !== "area" && n.kind !== "page");
  const plainBefore = String(before || "").replace(/\[\[[^\]]*(?:\]\[[^\]]*)?\]\]/g, " ");
  const wants = names.map(n => ({word: n.title, ref: n.ref, label: null}));
  wants.sort((a, b) => b.word.length - a.word.length);
  // Only plain words are touched: not what is already a link, code, an address
  // or a quoted Windows path ("C:\...\Nordic Lights\..." is a folder, #333).
  const parts = src.split(/(\[\[[^\]]*(?:\]\[[^\]]*)?\]\]|`[^`]*`|["\u201C](?:[A-Za-z]:|\\\\[^\\\s"\u201D]+)\\[^"\u201D\n]*["\u201D]|https?:\/\/\S+|file:\S+|(?:tel|telto|sms):(?:\/\/)?\+?\d[\d\s\-.()]*\d|mapto:[^|;\[\]#\n]+|(?:mailto|tel|telto|sms|geo|msteams|teams):\S+|\]\])/i);
  const linked = new Set(linksIn(src).map(l => trim(l.split("][")[0]).toLowerCase()));
  for (let i = 0; i < parts.length; i += 2) {
    let seg = parts[i];
    for (const w of wants) {
      if (linked.has(w.ref.toLowerCase())) continue;
      const multi = /\s/.test(w.word);
      if (!multi && w.word.length < 3) continue;
      const esc_ = w.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      // Next to a backslash the name is a folder in an unquoted path.
      const re = new RegExp("(^|[^\\p{L}\\p{N}_/\\\\])(" + esc_ + ")(?![\\p{L}\\p{N}_\\\\])", multi ? "giu" : "gu");
      if (plainBefore && new RegExp(re.source, re.flags).test(plainBefore)) continue;
      /* A sentence starts with a capital whatever the word is, so there the
         capital says nothing: "Review the budget" is not the page Review. A
         name with a capital of its own further in -- GroupTodo, NRK -- still is. */
      const plainCap = !multi && w.word.slice(1) === w.word.slice(1).toLowerCase();
      let m;
      while ((m = re.exec(seg)) && plainCap && sentenceStart(parts.slice(0, i).join("") + seg.slice(0, m.index + m[1].length))) {}
      if (!m) continue;
      const at = m.index + m[1].length;
      const link = "[[" + w.ref + (w.label ? "][" + w.label + "]]" : "]]");
      seg = seg.slice(0, at) + link + seg.slice(at + m[2].length);
      linked.add(w.ref.toLowerCase());
      // What was just inserted is markup now; split it out so the next name
      // cannot match inside it.
      const pieces = seg.split(/(\[\[[^\]]*(?:\]\[[^\]]*)?\]\])/);
      parts.splice(i, 1, ...pieces);
      seg = parts[i];
    }
    parts[i] = seg;
  }
  return parts.join("");
}
