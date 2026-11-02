/* Anybody you have a page for, person or organisation, found by any of their
   names. An organisation offers the people who work there, or itself. */
function pickInformTarget(onPick, title = "Send an update to") {
  const me = whoAmI();
  const people = peopleRows().filter(r => !r.me && !samePerson(r.name, me))
    .map(r => ({name: r.name, aliases: [...r.aliases]}));
  const orgs = allOrgNames().map(name => ({name, org: true,
    aliases: acrossNames(() => { const p = findExistingPage("o/" + name); return p ? pageAliases(p) : []; })}));
  if (!people.length && !orgs.length) { notify("No people or organisations to send to yet. Name somebody on the line as [[p/Name]].", "warn"); return; }
  listPicker({title, typeahead: true, items: [...people, ...orgs],
    label: t => (t.org ? "\u{1F3E2} " : "") + t.name,
    detail: t => [t.org ? "organisation" : personOrgs(t.name).join(", "), t.aliases.length ? "as " + t.aliases.join(", ") : ""]
      .filter(Boolean).join(" · "),
    search: t => [t.name, ...t.aliases].join(" "),
    onPick: t => {
      if (!t.org) { onPick({name: t.name}); return; }
      const staff = orgPeople(t.name).filter(n => !samePerson(n, me));
      if (!staff.length) { onPick({name: t.name, org: true}); return; }
      listPicker({title: "Who at " + t.name + "?", typeahead: true,
        items: [...staff.map(name => ({name})), {name: t.name, org: true}],
        label: x => x.org ? "\u{1F3E2} " + x.name + " itself" : x.name,
        detail: x => x.org ? orgProp(x.name, EMAIL_PROP) || "its own email" : emailOf(x.name, V.space) || "",
        onPick});
    }});
}
