function withoutTag(title, tag) {
  const lc = String(tag).toLowerCase();
  return trim(String(title || "").replace(NAMED_REF_RE, (whole, inside, label, lead, t) =>
    t !== undefined && t.toLowerCase() === lc ? lead : whole).replace(/\s{2,}/g, " "));
}
