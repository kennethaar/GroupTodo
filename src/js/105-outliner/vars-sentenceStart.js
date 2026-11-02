// The start of the line, after its TODO, a [[date]] or a link, or after a full stop.
const sentenceStart = before =>
  /(?:^|[.!?]\s)[\s"'(*_-]*$/u.test(String(before).replace(/^\s*[A-Z]{3,9}\s+/, "").replace(/^(?:\s*\[\[[^\]]*\]\])+/, ""));
