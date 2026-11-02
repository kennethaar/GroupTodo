function openBundleFromFile(onDone) {
  const input = el("input", {
    type: "file", accept: ".md,.markdown,text/markdown,text/plain", style: "display:none",
    onchange: async e => {
      const f = e.target.files[0];
      if (!f) return;
      const text = await f.text();
      const invite = parseInvite(text);
      if (invite) { input.remove(); openInviteArrived(invite, text); return; }
      const files = parseBundle(text);
      if (!files.size) { notify("That file has no GroupToDo pages in it.", "error"); return; }
      const report = mergeBundle(files);
      await mergeBundleAssets(text);
      markImported();
      notify(syncSummary(report));
      render();
      if (onDone) onDone(report);
      input.remove();
    },
  });
  document.body.append(input);
  input.click();
}
