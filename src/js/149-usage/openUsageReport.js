function openUsageReport() {
  const body = el("div", {class: "field"});
  const draw = () => {
    body.textContent = "";
    const {weeks, rows} = usageStats(), worth = usageWorth(), home = usageHome();
    body.append(el("div", {style: "font-size:13px;color:var(--fg2);margin-bottom:10px"},
      weeks ? "The last " + weeks + " week(s), on every device that writes to the log. " : "Nothing counted yet. ",
      "Weeks used comes first: a place you open once a week, like the weekly review, can matter more than " +
      "one you sit in all day, and the sidebar counts and reminders do their work without being opened. " +
      "So the last column is yours."));
    body.append(el("div", {class: "htable-wrap"}, el("table", {class: "htable"},
      el("thead", {}, el("tr", {}, ...["Place", "Weeks used", "Visits", "Minutes", "Per visit", "Actions", "Worth it"]
        .map(t => el("th", {}, t)))),
      el("tbody", {}, ...usageSorted(rows).map(x => {
        const rhythm = usageRhythm(x, weeks);
        const sel = el("select", {"aria-label": "Worth it: " + usageLabel(x.place),
          onchange: e => { setUsageWorth(x.place, e.target.value); }},
          ...USAGE_WORTH.map(([v, l]) => el("option", {value: v, selected: (worth[x.place] || "") === v || null}, l)));
        return el("tr", {},
          el("td", {}, usageLabel(x.place)),
          el("td", {}, x.weeks.size + " of " + weeks, el("small", {style: "display:block;color:var(--fg3)"}, rhythm)),
          el("td", {}, String(x.visits)),
          el("td", {}, usageMin(x.secs)),
          el("td", {}, usagePerVisit(x)),
          el("td", {}, String(x.acts)),
          el("td", {}, sel));
      })))));
    body.append(el("div", {style: "font-size:12px;color:var(--fg3);margin-top:10px"}, home
      ? "Kept on “Usage of GroupToDo” in " + home + ", which only you are in. Finished days go there; today stays on this device until tomorrow."
      : "No area of your own yet, so this stays on this device. Choose one in Vault & sync → Your use of GroupToDo."));
  };
  draw();
  modal({
    center: true, title: "Your use of GroupToDo", body,
    foot: [
      el("button", {class: "btn ghost", onclick: () => copyText(usageSummary(), "Copied as a table, ready to paste.", "Your use of GroupToDo")},
        "Copy summary"),
      usageHome() ? el("button", {class: "btn ghost", onclick: () => { closeModal(); openPageIn(usageHome(), USAGE_PATH); }}, "Open the log") : null,
      el("div", {style: "flex:1"}),
      el("button", {class: "btn primary", onclick: closeModal}, "Close"),
    ].filter(Boolean),
  });
}
