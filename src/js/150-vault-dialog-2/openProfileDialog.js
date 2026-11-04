/* Name and photo: who this area knows you as. Signing with by:: and done_by::
   stays automatic wherever the area asks for it. */
function openProfileDialog() {
  const area = Spaces.active || "this area";
  const nameInput = el("input", {placeholder: "Full name", value: whoAmI(), "aria-label": "Your name in " + area,
                                 style: "flex:1;min-width:0"});
  const face = el("span", {style: "display:contents"});
  const photoBtns = el("span", {style: "display:flex;gap:6px"});
  const drawAvatar = () => {
    const who = whoAmI();
    face.textContent = photoBtns.textContent = "";
    if (!who) return;
    face.append(avatarNode(who, 36));
    photoBtns.append(...[
      el("button", {class: "btn sm ghost", onclick: () => pickAvatar(who, drawAvatar)},
        avatarOf(who) ? "Change photo" : "Add photo"),
      avatarOf(who) ? el("button", {class: "btn sm ghost", title: "Remove photo", "aria-label": "Remove photo",
        onclick: () => { clearAvatar(who); drawAvatar(); }}, "✕") : null].filter(Boolean));
  };
  nameInput.addEventListener("change", () => {
    setIdentity(nameInput.value, Spaces.active);
    notify(trim(nameInput.value) ? "Saved as " + trim(nameInput.value) + "." : "Name cleared.");
    drawAvatar();
    render();
  });
  drawAvatar();
  settingsDialog("Profile - " + area, [
    el("div", {class: "field"}, el("label", {}, "Name"),
      el("div", {style: "display:flex;gap:12px;align-items:center"}, face, nameInput, photoBtns))], true);
}
