function openBookInfo({create = false} = {}) {
  const info = create ? {name: "", subtitle: "", synopsis: ""} : bookInfo();
  const name = el("input", {placeholder: "The long road", value: info.name});
  const subtitle = el("input", {placeholder: "A novel", value: info.subtitle});
  const synopsis = el("textarea", {placeholder: "What the book is about"});
  synopsis.value = info.synopsis;
  const field = (label, node) => el("div", {class: "field"}, el("label", {}, label), node);
  let area = null, where = null;
  if (create) {
    const areas = [V.space, ...Spaces.list.map(s => s.name).filter(n => n !== V.space)].filter(Boolean);
    area = areas[0] || BOOK_NEW_AREA;
    where = field("Area", segPicker([...areas.map(n => ({key: n, label: n})), {key: BOOK_NEW_AREA, label: "+ New area"}],
      area, k => { area = k; }));
  }
  const save = () => {
    const v = {name: trim(name.value), subtitle: subtitle.value, synopsis: synopsis.value};
    if (!v.name) { name.focus(); return; }
    closeModal();
    if (!create) return setBookInfo(v);
    if (area === V.space) return setupBook(v);
    if (area === BOOK_NEW_AREA) return newSpacePrompt(sp => openSpace(sp.name, {view: "book"}).then(() => setupBook(v)));
    openSpace(area, {view: "book"}).then(() => setupBook(v));
  };
  modal({center: true, title: create ? "New book" : "The book",
    body: el("div", {}, field("Name", name), field("Subtitle", subtitle), field("Synopsis", synopsis), where),
    foot: [el("button", {class: "btn ghost", onclick: closeModal}, "Cancel"),
           el("button", {class: "btn primary", onclick: save}, create ? "Create" : "Save")],
    onKey: e => {
      if (e.key === "Enter" && (e.target === name || e.target === subtitle || e.ctrlKey || e.metaKey)) { save(); return true; }
      return false;
    }});
  setTimeout(() => name.focus(), 30);
}
