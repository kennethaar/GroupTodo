function planFindProject(name) {
  const key = slugify(name).toLocaleLowerCase(), low = trim(name).toLocaleLowerCase();
  for (const code of ["1", "3", "2", "0"]) for (const p of projectsIn(code))
    if (baseName(p).toLocaleLowerCase() === key || pageTitle(p).toLocaleLowerCase() === low) return p;
  return null;
}
