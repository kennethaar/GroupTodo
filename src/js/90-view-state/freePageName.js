/* A free name in a folder, from a title: "Notes", "Notes 2", "Notes 3". */
function freePageName(dir, title, fallback) {
  const base = slugify(title).replace(/[\[\]#|]/g, "-").slice(0, 80).trim() || fallback;
  let name = base, n = 2;
  while (V.pages.has(join(dir, name + ".md"))) name = base + " " + n++;
  return {name, path: join(dir, name + ".md")};
}
