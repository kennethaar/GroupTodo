/* Import a file… in New from a template (#420). A project template comes back
   picked in the picker; a checklist opens, and says where it lives. */
function importTemplateFile() {
  const input = el("input", {type: "file", accept: ".md,.markdown,.txt,text/markdown,text/plain", style: "display:none",
    onchange: async e => {
      const f = e.target.files && e.target.files[0];
      input.remove();
      if (!f) return;
      const path = importTemplateText(f.name, await f.text());
      if (!path) { notify("That file has no list to make a template from.", "error"); return; }
      if (isProjectTemplate(path)) { openTemplatePicker(path); return; }
      notify(pageTitle(path) + " is a checklist now. It is in Settings, under Checklists.");
      openPage(path);
    }});
  document.body.append(input);
  input.click();
}
