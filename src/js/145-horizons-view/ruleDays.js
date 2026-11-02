function ruleDays(text) {
  const words = text.split(/\s*(?:,|\band\b|&|\s)\s*/).filter(Boolean);
  const days = words.map(ruleWeekday);
  return words.length && days.every(d => d >= 0) ? [...new Set(days)].sort() : null;
}
