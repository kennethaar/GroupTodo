function pageNamed(path, name) {
  const n = trim(String(name || "")).toLowerCase();
  if (!n) return false;
  return findExistingPage(name) === path || pageTitle(path).toLowerCase() === n ||
    baseName(path).toLowerCase() === n || pageRef(path).toLowerCase() === n;
}
