/* Import from a .vcf, or the phone's own contacts (#383). Nothing is written
   until Import: first each person is shown as New, Changed or Same, the first
   two ticked. A person already here keeps every value the card does not have,
   and the lines on their page. */
function openVCardImport(text, cards = parseVCards(text)) {
  if (!cards.length) { notify("No contacts found in that file.", "warn"); return; }
  const norm = {phone: v => v.map(x => x.replace(/[^\d+]/g, "")).join(","),
    email: v => v.map(x => x.toLowerCase()).join(","), org: v => v.toLowerCase(), birthday: v => v};
  const keys = Object.keys(norm);
  const has = (c, k) => Array.isArray(c[k]) ? c[k].length > 0 : !!c[k];
  const rows = cards.map(c => {
    const path = personPath(c.name);
    const here = V.pages.has(path) ? vcardOfPerson(path) : null;
    const diff = here ? keys.filter(k => has(c, k) && norm[k](c[k]) !== norm[k](here[k])) : keys.filter(k => has(c, k));
    const status = !here ? "New" : diff.length ? "Changed" : "Same";
    return {c, path, status, diff, on: status !== "Same"};
  });
  const label = {phone: "phone", email: "email", org: "organisation", birthday: "birthday"};
  const go = el("button", {class: "btn primary"});
  const count = () => {
    const n = rows.filter(r => r.on).length;
    go.textContent = "Import " + n;
    go.disabled = !n;
  };
  const list = el("div", {class: "vclist"}, ...rows.map(r => {
    const box = el("input", {type: "checkbox", onchange: () => { r.on = box.checked; count(); }});
    box.checked = r.on;
    box.disabled = r.status === "Same";
    return el("label", {class: "vcrow"}, box,
      el("span", {class: "vcname"}, r.c.name),
      el("span", {class: "vcstat vc" + r.status.toLowerCase()}, r.status),
      el("span", {class: "vcwhat"}, r.status === "Same" ? "" : r.diff.map(k => label[k]).join(", ")));
  }));
  const write = () => {
    let made = 0, changed = 0;
    for (const r of rows.filter(x => x.on)) {
      const page = V.pages.get(r.path) || putPage(r.path, {props: {title: r.c.name}, blocks: []});
      if (r.status === "New") made++; else changed++;
      const props = page.props || (page.props = {});
      const keyFor = (re, fallback) => Object.keys(props).find(k => re.test(k.toLowerCase())) || fallback;
      if (r.c.phone.length) props[keyFor(VCARD_PHONE_KEY, "phone")] = r.c.phone.join(", ");
      if (r.c.email.length) props[keyFor(VCARD_EMAIL_KEY, EMAIL_PROP)] = r.c.email.join(", ");
      if (r.c.org) props[keyFor(/^(org|organisation|organization)$/, "org")] = "[[o/" + r.c.org.replace(/[\[\]|#]/g, "") + "]]";
      if (r.c.birthday) props[keyFor(new RegExp("^" + BIRTHDAY_PROP + "$"), BIRTHDAY_PROP)] = r.c.birthday;
      touch(r.path);
    }
    closeModal();
    render();
    notify([made ? made + " new" : "", changed ? changed + " changed" : ""].filter(Boolean).join(", ") + ".");
  };
  go.onclick = write;
  count();
  modal({
    center: true, title: "Import contacts",
    body: el("div", {class: "vcbox"},
      el("p", {class: "vcnote"}, "Tick who to bring in. Nothing is written before Import."), list),
    foot: [el("button", {class: "btn ghost", onclick: closeModal}, "Cancel"), el("div", {style: "flex:1"}), go],
  });
}
