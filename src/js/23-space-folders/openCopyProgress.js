/* Pages copied into a folder, shown as they go (#364): a bar, how many are
   done, the ones the folder already had and kept, and at the end what is
   there now. It is a save job like any other (jobsSaving / jobsSaved), so it
   follows the real writes. Save log is there in case the count looks wrong. */
function openCopyProgress(folder, {skipped = 0, name = Spaces.active} = {}) {
  const bar = el("i", {}), count = el("div", {style: "font-size:13px;margin-top:6px"}, "Starting...");
  const result = el("div", {class: "field", hidden: true});
  const foot = el("div", {style: "display:contents"});
  modal({center: true, title: "Copying to “" + folder + "”",
    body: el("div", {},
      el("div", {class: "field"}, el("div", {class: "jbar"}, bar), count,
        skipped ? el("div", {style: "color:var(--fg3);font-size:12.5px;margin-top:4px"},
          skipped + " already in the folder, kept as they are") : null),
      result),
    foot: [foot]});
  const job = {
    untilSaved: true, label: "Copying",
    set(n, total) {
      bar.style.width = (total ? Math.min(100, Math.round(100 * n / total)) : 0) + "%";
      count.textContent = n + " of " + total;
    },
    retitle() {},
    finish(msg, level = "info") {
      JOBS.delete(job);
      bar.style.width = "100%";
      const rec = LOADED.get(name);
      let projects = 0, tasks = 0;
      if (rec) for (const [path, page] of rec.pages) {
        if (statusDirOf(path)) projects++;
        walkBlocks(page.blocks || [], b => { if (b.state) tasks++; });
      }
      count.textContent = level === "info" ? "All copied." : msg;
      result.hidden = false;
      result.replaceChildren(el("b", {}, "Done: " + projects + (projects === 1 ? " project, " : " projects, ") +
        tasks + (tasks === 1 ? " task" : " tasks") + " in “" + folder + "”."));
      foot.replaceChildren(
        el("button", {class: "btn ghost", onclick: () => notify("Log saved to your downloads: " + saveAppLog("Copy to " + folder))}, "Save log"),
        el("div", {style: "flex:1"}),
        el("button", {class: "btn primary", onclick: closeModal}, "Done"));
      appLog("copy to " + folder + " finished: " + projects + " projects, " + tasks + " tasks" + (level === "info" ? "" : " - " + msg));
    },
  };
  JOBS.add(job);
  return job;
}
