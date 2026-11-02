function urgencyOf(a) {
  if (a._urgency == null) a._urgency = Math.round(urgencyParts(a).reduce((s, [, n]) => s + n, 0) * 10) / 10;
  return a._urgency;
}
