function cadenceFrom(name) {
  const m = /\b(daily|weekly|fortnightly|monthly|quarterly|yearly|annual(?:ly)?)\b/i.exec(name || "");
  if (!m) return "as needed";
  return m[1].toLowerCase().replace(/^annually$/, "annual");
}
