/* Any number of minutes, hours, days or weeks before, as many as wanted.
   Done saves the list; none left is Off. */
function drawMeetRemindCustom(url = null) {
  const leads = meetRemindLeads(url ? calFeedId(url) : null);
  const num = el("input", {class: "remnum", type: "number", min: "1", step: "1", inputmode: "numeric",
    "aria-label": "How many", style: "width:5em"});
  const unit = el("select", {class: "remunit", "aria-label": "Unit"},
    ...MEET_REMIND_UNITS.map(([u]) => el("option", {value: u}, u)));
  const err = el("span", {class: "remerr", role: "alert"});
  const list = el("ul", {class: "remlist"});
  const paint = () => {
    list.replaceChildren(...leads.map((n, i) => el("li", {},
      el("span", {}, n ? meetLeadWords(n) : "At start"),
      el("button", {class: "textbtn", "aria-label": "Remove " + meetLeadWords(n), onclick: () => { leads.splice(i, 1); paint(); }}, "×"))));
    list.hidden = !leads.length;
  };
  const add = () => {
    const k = Number(num.value), n = k * MEET_REMIND_UNITS.find(([u]) => u === unit.value)[1];
    err.textContent = "";
    if (!Number.isInteger(k) || k < 1) { err.textContent = "Enter a whole number"; return num.focus(); }
    if (leads.includes(n)) { err.textContent = "Already there"; return num.focus(); }
    leads.push(n); leads.sort((a, b) => a - b);
    num.value = ""; paint(); num.focus();
  };
  num.onkeydown = e => { if (e.key === "Enter") { e.preventDefault(); add(); } };
  paint();
  calScreen({
    title: "Custom reminder", back: url ? "Reminders" : "Meeting reminder", backTo: () => drawMeetRemind(url),
    body: el("div", {style: "padding:4px 16px"},
      el("div", {class: "callabel", style: "padding-left:0"}, "Remind me"),
      el("div", {class: "remadd"}, num, unit, el("span", {}, "before"), err),
      el("button", {class: "textbtn", onclick: add}, "+ Add reminder"),
      el("div", {class: "callabel", style: "padding-left:0"}, "Reminders"), list),
    foot: [el("button", {class: "btn primary", onclick: () => {
      setMeetRemind(url, leads);
      meetAskNotify(leads);
      meetingTick();
      drawMeetRemind(url);
    }}, "Done")],
  });
}
