function statusDirOf(path) {
  const m = new RegExp("^" + PAGES + "/([-0123])/").exec(path || "");
  return m ? m[1] : null;
}
