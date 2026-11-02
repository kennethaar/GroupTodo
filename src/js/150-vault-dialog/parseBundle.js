function parseBundle(text) {
  const files = new Map();
  const re = /<!--\s*gtd:file\s+(.+?)\s*-->\n([\s\S]*?)\n?<!--\s*gtd:endfile\s*-->/g;
  let m;
  while ((m = re.exec(text))) files.set(trim(m[1]), m[2]);
  return files;
}
