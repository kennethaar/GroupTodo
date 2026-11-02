/* `space` is the area whose copy of the page gets the picture. The file dialog
   answers long after the click, when another area may be the active one, so it
   is named rather than taken from wherever V happens to point by then. */
function pickAvatar(name, then, space) {
  const input = el("input", {type: "file", accept: "image/*", style: "display:none",
    onchange: async e => {
      const f = e.target.files[0];
      input.remove();
      if (!f) return;
      try {
        const data = await shrinkToDataURI(f, 96, AVATAR_MAX);
        if (!data) { notify("Could not get that picture small enough. Try a simpler one.", "warn"); return; }
        inSpace(space, () => {
          const path = personPath(name);
          const page = V.pages.has(path) ? getPage(path) : {props: {title: name}, blocks: []};
          page.props[AVATAR_PROP] = data;
          putPage(path, page);
        });
        notify("Picture set" + (space ? " for " + space : "") + " - " + Math.round(data.length / 1024) + "KB in your page.");
        render();
        if (then) then();
      } catch (_) { notify("That file did not read as an image.", "error"); }
    }});
  document.body.append(input);
  input.click();
}
