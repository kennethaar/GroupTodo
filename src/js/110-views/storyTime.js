function storyTime(when) {
  const w = oneLine(when);
  if (!w) return null;
  const part = (DAY_PARTS.find(([re]) => re.test(w)) || [, 0])[1];
  const date = /^(\d{3,4})(?:-(\d{1,2})(?:-(\d{1,2}))?)?\b/.exec(w);
  if (date) return {kind: "date", at: +date[1] * 10000 + (+date[2] || 0) * 100 + (+date[3] || 0) + part};
  const day = /^(?:day|dag|tag|jour|día)?\s*(\d{1,5})\b/i.exec(w);
  if (day) return {kind: "day", at: +day[1] + part};
  return null;
}
