/* The app talks to no host but your own sync server (see the policy at the
   top), so GitHub is a page you open, and the file comes in the way every
   other file does: picked, or put in the folder. */
function openLanguageGitHub() {
  const url = "https://github.com/" + LANG_GITHUB + "/tree/HEAD/" + LANG_GITHUB_DIR;
  const pick = el("input", {type: "file", accept: ".md,.txt,text/markdown,text/plain", style: "display:none"});
  pick.addEventListener("change", async () => {
    const f = pick.files && pick.files[0];
    if (f && await langImport(await f.text(), f.name)) openLanguageDialog();
  });
  const step = (n, text, button) => el("div", {style: "display:flex;gap:10px;align-items:flex-start;margin-top:10px"},
    el("span", {class: "k"}, n), el("div", {style: "flex:1"}, el("div", {}, text), button || null));
  modal({
    center: true, title: "Get a language from GitHub",
    body: el("div", {}, el("div", {class: "field"},
      step("1", "Open the languages folder on GitHub and download the file for your language.",
        el("button", {class: "btn ghost", style: "margin-top:6px",
          onclick: () => window.open(url, "_blank", "noopener")}, "Open GitHub")),
      step("2", "Open the downloaded file here.",
        el("button", {class: "btn ghost", style: "margin-top:6px", onclick: () => pick.click()}, "Open the file")),
      pick,
      el("div", {class: "hint", style: "text-align:left;margin-top:12px"},
        "Or put the file in pages/8/Languages in the area's folder: it is on the list the next time the area opens. " +
        "No language there yet? Translate it yourself, and share it by adding the file to that folder on GitHub."))),
    foot: [el("button", {class: "btn ghost", onclick: () => openLanguageDialog()}, "Back"),
      el("div", {style: "flex:1"}), el("button", {class: "btn ghost", onclick: closeModal}, "Close")],
  });
}
