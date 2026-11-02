function parseSplit(text) {
  return String(text || "").split(/[;,](?=\s*[^\d\s])/)
    .map(s => /^\s*(.*?)\s*(\d+(?:[.,]\d+)?)\s*%?\s*$/.exec(s))
    .filter(m => m && trim(m[1])).map(m => ({name: trim(m[1]), pct: numIn(m[2])}));
}
