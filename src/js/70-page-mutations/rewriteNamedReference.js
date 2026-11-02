function rewriteNamedReference(value, oldRef, newRef) {
  if (typeof value !== "string" || oldRef === newRef) return value;
  return value.replace(NAMED_REF_RE, (whole, inside, label, lead, tag) => {
    if (tag !== undefined) {
      if (tag !== oldRef) return whole;
      return lead + (BARE_TAG_RE.test(newRef) ? "#" + newRef : "#[[" + newRef + "]]");
    }
    const pipe = inside.indexOf("|");
    const target = pipe < 0 ? inside : inside.slice(0, pipe);
    const hash = target.indexOf("#");
    if ((hash < 0 ? target : target.slice(0, hash)) !== oldRef) return whole;
    return "[[" + newRef + (hash < 0 ? "" : target.slice(hash)) + (pipe < 0 ? "" : inside.slice(pipe)) +
           (label == null ? "]]" : "][" + label + "]]");
  });
}
