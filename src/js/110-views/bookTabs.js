/* ---------- Book (#240) ----------
   The chapters of the book shown, in order: where each is, and its words; the
   words so far against the goal on top, with how many chapters are done. With
   more than one book, a tab per book shows it, in its own area. */
function bookTabs(books) {
  const cur = bookPath();
  return el("div", {class: "fbar booktabs", role: "tablist"}, ...books.map(b => {
    const on = b.area === V.space && b.path === cur;
    const tab = fchip(b.name, on, () => !on && showBook(b));
    tab.title = "In " + b.area;
    tab.setAttribute("role", "tab");
    return tab;
  }), el("button", {class: "textbtn", onclick: () => openBookInfo({create: true})}, "+ New book"));
}
