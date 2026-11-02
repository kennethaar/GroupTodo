function downloadText(name, text, type = "text/markdown") {
  const url = URL.createObjectURL(new Blob([text], {type}));
  const a = el("a", {href: url, download: name});
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
