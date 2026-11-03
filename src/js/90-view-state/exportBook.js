function exportBook() {
  sendMarkdownOut("manuscript.md", bookManuscript(), {title: "Book"}).then(how =>
    notify((how === "shared" ? "Sent " : "Exported ") + bookChapters().length + " chapters as manuscript.md."));
}
