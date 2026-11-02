// A picked task names its page by its words, not "TODO" and its [[c/...]].
const pastedTitle = raw => {
  const l = trim((String(raw || "").split(/\r?\n/).map(trim).find(Boolean) || "").replace(BULLET_RE, "$2"));
  const [st, rest] = splitState(l);
  return plainTitle(st ? rest : l);
};
