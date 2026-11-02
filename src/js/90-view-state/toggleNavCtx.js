function toggleNavCtx(top) {
  const open = navCtxOpen();
  if (open.has(top)) open.delete(top); else open.add(top);
  PREF.set("nav.ctxKids", JSON.stringify([...open]));
  renderNav();
}
