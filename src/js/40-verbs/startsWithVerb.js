function startsWithVerb(title) {
  const m = /^\s*([\p{L}\p{M}\-]+)/u.exec(withoutMarks(title));
  if (!m) return false;
  return !!VERB_LOOKUP[m[1].toLowerCase()];
}
