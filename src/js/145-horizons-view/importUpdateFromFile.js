function importUpdateFromFile() {
  const input = el("input", {type: "file", accept: ".md,.markdown,.txt,text/markdown,text/plain",
    style: "display:none",
    onchange: async e => {
      const f = e.target.files && e.target.files[0];
      input.remove();
      if (!f) return;
      const text = await f.text();
      const data = parseUpdateReply(text);
      if (!data) { notify("That file is not a GroupToDo update.", "error"); return; }
      openUpdateArrived(data);
    }});
  document.body.append(input);
  input.click();
}
