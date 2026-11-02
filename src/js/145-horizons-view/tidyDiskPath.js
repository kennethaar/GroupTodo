function tidyDiskPath(text) {
  let p = trim(String(text || "")).replace(/^["']|["']$/g, "");
  if (FILE_LINK_RE.test(p)) p = filePathOf(p);
  return p.replace(/[\\/]+$/, "");
}
