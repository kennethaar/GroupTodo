/* Where a slide element's place is kept (#487), as {get(), set(v)} for one
   key: a line keeps its own at::, the title its slide's title-at::, and a
   picture focus:: on the line whose notepad holds it. A page's title slide
   keeps them on the page. null when the element has no place to keep. */
function slideArrOwner(s, kind, id) {
  let b = null;
  if (kind === "title") b = s.home;
  else if (kind === "line") {
    walkBlocks([...(s.kids || []), ...(s.parts || []).filter(p => p && typeof p === "object" && p.id)], x => { if (!b && String(x.id) === String(id)) b = x; });
    if (!b) return null;
  } else if (kind === "pic") {
    const i = (s.pics || []).indexOf(id);
    b = id === s.cover || i < 0 ? s.home : s.parts[i];
  }
  const key = kind === "line" ? "at" : kind === "title" ? "title-at" : "focus";
  const page = getPage(s.path);
  if (!b && !page) return null;
  const props = () => b ? (b.props = b.props || {}) : (page.props = page.props || {});
  return {
    key,
    get: () => b ? blockProp(b, key) : props()[key] || null,
    set: v => {
      const p = props(), k = Object.keys(p).find(x => x.toLowerCase() === key) || key;
      if (v == null) delete p[k]; else p[k] = v;
      touch(s.path);
    },
  };
}
