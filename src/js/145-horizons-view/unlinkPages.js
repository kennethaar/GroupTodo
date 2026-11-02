function unlinkPages(fromNode, toRef) {
  if (!fromNode || fromNode.ghost) return false;
  return inSpace(fromNode.space, () => {
    const page = getPage(fromNode.path);
    if (!page) return false;
    let cut = 0;
    const strip = list => {
      for (let i = list.length - 1; i >= 0; i--) {
        const x = list[i];
        if (x.children) strip(x.children);
        const hits = linksIn(x.title)
          .some(t => trim(t.split("][")[0]).toLowerCase() === toRef.toLowerCase());
        if (!hits) continue;
        // A line that is only the link goes; a sentence that mentions it keeps
        // its words and loses the link, because the words are not ours to bin.
        if (trim(x.title.replace(/\[\[[^\]]+(?:\]\[[^\]]*)?\]\]/g, "")) === "" && !(x.children || []).length) {
          list.splice(i, 1);
        } else {
          x.title = trim(x.title.replace(new RegExp("\\[\\[" +
            toRef.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(\\]\\[[^\\]]*)?\\]\\]", "gi"), ""))
            .replace(/\s{2,}/g, " ");
        }
        cut++;
      }
    };
    strip(page.blocks);
    if (cut) touch(fromNode.path);
    return cut > 0;
  });
}
