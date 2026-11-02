/* key:: value, as the file writes it. Typed back in, it is read the same way --
   so renaming the key renames the property and emptying the value takes it
   off, both without leaving the line. */
function saveRawProp(path, key, text) {
  const page = getPage(path); if (!page) return;
  const s = trim(text);
  const m = /^([\p{L}\p{N}_-]+)\s*::\s*([\s\S]*)$/u.exec(s);
  const drop = k => { for (const old of Object.keys(page.props)) if (old.toLowerCase() === k) delete page.props[old]; };
  if (!s) {
    if (!key) return;
    drop(key.toLowerCase()); touch(path);
    notify(key + " taken off.");
    return;
  }
  if (!m) {                           // just the value, key left alone
    if (!key) { notify("A property is written  key:: value.", "warn"); return; }
    page.props[key] = s; touch(path);
    if (WAIT_KEYS.includes(key.toLowerCase())) shelveAsWaiting(path);
    return;
  }
  const k = m[1].toLowerCase(), v = trim(m[2]);
  const namesBefore = pageAliases(path);
  if (key && k !== key.toLowerCase()) drop(key.toLowerCase());
  page.props[k] = v;
  // An alias is a name, not a page to make: [[JS]] in it would have made one.
  if (!ALIAS_KEYS.includes(k)) createLinkedPages(v);
  touch(path);
  if (v && WAIT_KEYS.includes(k)) shelveAsWaiting(path);
  if (ALIAS_KEYS.includes(k)) {
    const twins = aliasTwins(path, namesBefore);
    // After the Enter that saved the line, or that same keypress answers the question.
    if (twins.length) setTimeout(() => askAliasMerge(path, twins), 0);
  }
}
