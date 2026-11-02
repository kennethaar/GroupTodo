function timeLogPersonRef(name) {
  const p = personPath(name);
  return V.pages.has(p) ? pageRef(p) : "p/" + name.replace(/[\/]/g, "-");
}
