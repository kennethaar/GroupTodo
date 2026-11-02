function branchLabel(b) {
  const text = linkWords(String(b.title || ""));
  return text.length > 55 ? text.slice(0, 52) + "..." : (text || "Untitled");
}
