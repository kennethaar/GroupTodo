function askQuestionParts(item, recipient) {
  const raw = askUntagged(item.title);
  let text = raw;
  const full = trim(recipient || ""), first = full.split(/\s+/)[0];
  /* A line that names somebody else as well, "ask Johan and Jenny about X",
     goes as you wrote it: taking one name out leaves the others making no
     sense, and who else is in it is part of the question. */
  const others = full ? peopleNamedIn(item.title || "").filter(n => !samePerson(n, full)) : [];
  // The whole name wherever it stands; the first name alone only where it is
  // plainly the one being asked: after the asking, or at either end.
  if (full && !others.length) text = text.replace(askNameRe(full), " ");
  if (first && first !== full && !others.length) {
    const safe = askEsc(first);
    text = text.replace(new RegExp("(?<![\\p{L}\\p{N}])(?:" + ASK_VERB + ")\\s+" + safe + "(?![\\p{L}\\p{N}])", "giu"), " ")
      .replace(new RegExp("^\\s*" + safe + "(?![\\p{L}\\p{N}])|(?<![\\p{L}\\p{N}])" + safe + "\\s*[?.!]?\\s*$", "giu"), " ");
  }
  const named = text !== raw;
  /* "svar fra [name] om X": the from that pointed at them goes with the
     name, or the question reads "svar fra om X". */
  if (named) text = text.replace(new RegExp("(?<![\\p{L}\\p{N}])(?:fra|från|fram|from|von|til|to|with|med|for|of)\\s+" +
    "(?=(?:" + ASK_ABOUT + ")(?![\\p{L}\\p{N}]))", "giu"), "");
  const tidy = s => trim(s.replace(/\s+/g, " ").replace(/\s+([?.!,:;])/g, "$1").replace(/([?!.])[?!.]+/g, "$1")
    .replace(/^[\s,:;\-]+|[\s,:;\-]+$/g, ""));
  text = tidy(text);
  if (named) {
    let asked = false;
    const inv = new RegExp("^(?:" + ASK_INDIRECT + ")\\s+(\\S+)\\s+(" + ASK_FINITE + ")(?![\\p{L}])", "iu").exec(text);
    if (inv) { text = inv[2] + " " + inv[1] + text.slice(inv[0].length); asked = true; }
    else text = text.replace(new RegExp("^(?:" + ASK_ABOUT + ")\\s+", "iu"), "");
    // "hva som må gjøres" is asked as "hva må gjøres?"
    text = text.replace(/^(hv\p{L}*|va\p{L}*|vem|vilk\p{L}*)\s+(?:som|der)\s+/iu, "$1 ");
    // What is left of "status på [name]": the på that pointed at them.
    text = tidy(text.replace(/\s+(?:på|til|med|to|with|for|of|on|fra|från|from|von)\s*([?.!]?)$/iu, "$1"));
    const lead = (text.split(/\s/)[0] || "").replace(/[^\p{L}]/gu, "");
    if (asked || ASK_QWORD.test(lead)) {
      const m = /^([^.!?]+)([.!?]?)([\s\S]*)$/.exec(text);
      if (m && m[2] !== "?") text = trim(m[1]) + "?" + m[3];
    }
  }
  if (text) text = text.charAt(0).toUpperCase() + text.slice(1);
  const words = text.toLowerCase().replace(/[^\p{L}\s']/gu, " ").replace(/'s\b/g, " er").split(/\s+/).filter(Boolean);
  const generic = words.every(w => ASK_GENERIC.has(w));
  const t = ASK_NOTE[askLang()];
  // The question written on the task (ask::) is asked as it is (#344); the
  // line's own words then say what it is about, when no project does.
  const own = trim(item.ask || "");
  let subject = trim(item.project || "");
  if (!subject) {
    // From a day page, the question has no project: what it is about is the
    // sentence before the question, when there is one.
    const m = /^([\s\S]*[.!])\s+([^.!?]+\?)$/.exec(text);
    if (m) return {subject: tidy(m[1].replace(/[.!]$/, "")), ask: own || m[2]};
    if (generic && item.context && item.context[0]) subject = item.context[0].text;
    else if (generic) return {subject: "", ask: own || (named ? raw : text || raw)};
    else if (own) subject = text;
  }
  return {subject, ask: own || (generic ? t.status : text)};
}
