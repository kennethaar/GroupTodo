/* "the last friday", "2nd tuesday" -> {nth, wd}. */
function ruleNthDay(text) {
  const m = /^(?:the\s+)?(\S+)\s+(\S+)$/.exec(text);
  if (!m || !(m[1] in RULE_NTH)) return null;
  const wd = ruleWeekday(m[2]);
  return wd < 0 ? null : {nth: RULE_NTH[m[1]], wd};
}
