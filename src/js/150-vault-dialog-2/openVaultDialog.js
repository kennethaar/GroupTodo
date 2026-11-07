/* Settings. Every row is label, what it is now, one action. Storage and file
   syntax stay out of it; rarely used setup lives one level down (Integrations,
   Advanced, Profile, Area). */
function openVaultDialog() {
  tourMarkSeen("vault");
  const lastSync = getSetting("last_sync");
  const linkedKnown = !!LINKED;
  const onFolder = V.backend && V.backend.kind === "fs";
  const area = Spaces.active || "this area";
  const btn = (text, fn, cls) => el("button", {class: "btn sm " + (cls || "ghost"), onclick: fn}, text);

  /* Vault & sync */
  const folderRow = CAP.dirPicker
    ? settingsRow("Folder", onFolder ? V.backend.label || "" : "None - kept in this browser",
        btn(onFolder ? "Change" : "Choose", connectFolder, onFolder ? "ghost" : "primary"))
    : settingsRow("Folder", "Kept in this browser");
  const memoryRow = CAP.persist === "memory"
    ? settingsRow("Not stored", CAP.sandboxed ? "Locked preview" : "This browser keeps nothing",
        btn("Save vault file", () => saveBundleAsDownload()), "warn")
    : null;
  const phoneRow = CAP.savePicker
    ? (linkedKnown
        ? settingsRow("Phone sync", lastSync ? "Last synced " + formatStamp(lastSync) : "Not synced yet",
            btn("Sync", syncLinked, "primary"))
        : settingsRow("Phone sync", "Not set up", btn("Set up", linkVaultFile, "primary")))
    : settingsRow("Phone sync", "Vault file", btn(canShareFiles() ? "Send" : "Save", () => saveBundleAsDownload(), "primary"));
  const autoRow = CAP.savePicker && linkedKnown
    ? settingsRow("Sync automatically", null, settingsToggle(autoSyncOn(), "Sync automatically", on => {
        PREF.set("autosync", on ? "1" : "0");
        notify(on ? "Syncing on its own." : "Sync only when you press it.");
      }))
    : null;
  const inviteRow = settingsRow("Invite somebody", null,
    btn("Invite", () => { closeModal(); openShareSpaceInvite(); }));

  /* You */
  const who = whoAmI();
  const wh = workHours();
  const from = clockInput(wh.start, {placeholder: "From", "aria-label": "Working hours from"});
  const to = clockInput(wh.end, {placeholder: "To", "aria-label": "Working hours to"});
  const saveHours = () => {
    if (!!from.value !== !!to.value) return;     // half a workday is not one yet
    if ([from, to].some(i => i.classList.contains("bad"))) return;
    if (from.value && from.value === to.value) { notify("Start and finish cannot be the same time.", "warn"); return; }
    setWorkHours(from.value, to.value);
    notify(from.value ? "Working " + from.value + " to " + to.value + "." : "Working hours back to 08:00 to 16:00.");
  };
  from.addEventListener("change", saveHours);
  to.addEventListener("change", saveHours);
  const profileRow = settingsRow(who || "Your name", who ? null : "Not set", btn(who ? "Edit" : "Add", openProfileDialog));
  const hoursRow = settingsRow("Working hours", null,
    el("span", {style: "display:flex;gap:6px;align-items:center"}, from, el("span", {}, "–"), to));

  /* Preferences */
  const birthdayRow = settingsRow("Past birthday tasks", null,
    settingsSelect("Past birthday tasks", [["1", "Cancel automatically"], ["0", "Keep"]],
      birthdayTasksExpire() ? "1" : "0", v => {
        PREF.set("expire.birthdays", v);
        notify(v === "1" ? "Birthday tasks go once the birthday has passed." : "Birthday tasks stay until you deal with them.");
        if (v === "1") expireOverdue();
      }));
  const clockRow = settingsRow("Track time in Doing", null, settingsToggle(clockOnDoing(), "Track time in Doing", on => {
    PREF.set("clock.doing", on ? "1" : "0");
    notify(on ? "Doing starts a clock." : "Doing starts no clock.");
  }));
  const rounds = actChoreRounds();
  const choreOpts = [["0", "Never"], ["1", "After 1 round"], ["2", "After 2 rounds"], ["3", "After 3 rounds"]];
  if (!choreOpts.some(o => o[0] === String(rounds))) choreOpts.push([String(rounds), "After " + rounds + " rounds"]);
  const choreRow = settingsRow("Missed chores", null,
    settingsSelect("Missed chores", choreOpts, String(rounds), v => {
      PREF.set("review.chores", v);
      notify(+v ? "The review shows chores missed for " + v + (v === "1" ? " round." : " rounds.") : "The review leaves chores out.");
    }));
  const linksRow = settingsRow("Phone/place links", null,
    settingsSelect("Phone/place links", [["", "Open on this computer"], ["1", "Show QR code"]],
      qrFirst() ? "1" : "", v => {
        PREF.set("links.qr", v);
        notify(v ? "Phone numbers and places show a QR code." : "Phone numbers and places open on this PC.");
        render();
      }));
  const askRow = settingsRow("Context check", null,
    settingsSelect("Context check", [["", "Off"], ["1", "Noon and 17:00"]],
      contextPromptsOn() ? "1" : "", v => {
        PREF.set("context.prompts", v);
        notify(v ? "Asking at 12:00 and 17:00." : "Not asking about your context.");
      }));
  const senseRow = settingsRow("Suggest context at startup", null, settingsToggle(senseOn(), "Suggest context at startup", on => {
    PREF.set("sense.on", on ? "1" : "");
    notify(on ? "Offering a context when GroupToDo opens." : "Not sensing where you are.");
  }));
  const placesRow = settingsRow("Saved places", null, btn("Manage", () => { closeModal(); openSenseSetup(); }));

  /* Area */
  const areaRow = settingsRow(area, horizonProfile().label + " · " + paletteName(spaceColor(Spaces.active)),
    btn("Manage", openAreaSettings));

  /* GroupToDo */
  const langs = langNames(), curLang = PREF.get("lang", "") || LANG_BASE;
  const langRow = settingsRow("Language", null,
    settingsSelect("Language", [...langs.map(n => [n, n]), ["\u0000more", "More languages…"]], curLang, v => {
      if (v === "\u0000more") { openLanguageDialog(); return; }
      langChoose(v); openVaultDialog();
    }));
  let detected = "UTC";
  try { detected = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"; } catch (_) {}
  let zones = [];
  try { zones = Intl.supportedValuesOf("timeZone") || []; } catch (_) {}
  if (!zones.length) zones = ["UTC", "Europe/Oslo", "Europe/London", "Europe/Berlin", "America/New_York",
                              "America/Los_Angeles", "Asia/Singapore", "Asia/Tokyo", "Australia/Sydney"];
  if (!zones.includes(detected)) zones.unshift(detected);
  const zoneRow = settingsRow("Timezone", null,
    settingsSelect("Timezone", [["", "This device (" + detected + ")"], ...zones.map(z => [z, z])],
      PREF.get("timezone", "") || "", v => {
        PREF.set("timezone", v);
        notify("Times shown in " + (v || detected) + ".");
        render();
      }));
  const updateRows = updatesPossible() ? [
    settingsRow("Updates", null, settingsToggle(updatesOn(), "Check for updates", on => PREF.set("update.check", on ? "on" : "off"))),
    settingsRow("Version " + APP_VERSION, null, btn("Check now", () => checkForUpdate({quiet: false}))),
  ] : [];
  const newsRow = settingsRow("What's new", null,
    btn("Read", () => whatsNewDialog(newsEntries(HELP_NEWS).slice(0, 1))));

  const fileInput = el("input", {
    type: "file", accept: ".md,.org,text/markdown", multiple: true, style: "display:none",
    onchange: async e => {
      let n = 0;
      for (const f of e.target.files) {
        const text = await f.text();
        const bundle = parseBundle(text);
        if (bundle.size) { const r = mergeBundle(bundle); await mergeBundleAssets(text); notify(syncSummary(r)); n += bundle.size; continue; }
        const rel = (f.webkitRelativePath || f.name).replace(/^[^/]*\//, "");
        if (/\.org$/i.test(f.name)) putPage(rel.replace(/\.org$/i, ".md"), orgToPage(text));
        else putPage(rel, parsePage(text));
        n++;
      }
      scanVerbs();
      notify("Imported " + n + " file(s).");
      closeModal(); render();
    },
  });
  const importRow = settingsRow("Import files", null, el("span", {style: "display:flex;gap:6px"},
    btn("Choose", () => fileInput.click()),
    V.raw.size ? btn("Convert " + V.raw.size + " .org files", () => { importOrgFiles(); closeModal(); }) : null,
    fileInput));

  modal({
    center: true, title: "Vault & sync - " + (Spaces.active || "area"),
    body: el("div", {},
      settingsGroup("Vault & sync", [memoryRow, folderRow, phoneRow, autoRow, inviteRow]),
      settingsGroup("You", [profileRow, hoursRow]),
      settingsGroup("Preferences", [birthdayRow, clockRow, choreRow, linksRow, askRow, senseRow, placesRow]),
      settingsGroup("Personal", [areaRow]),
      settingsGroup("GroupToDo", [langRow, zoneRow, ...updateRows, newsRow,
        settingsRow("Integrations", null, btn("›", openIntegrationsDialog)),
        settingsRow("Advanced", null, btn("›", openAdvancedDialog)),
        importRow]),
      settingsGroup(null, [settingsRow("Start afresh", null,
        el("button", {class: "btn sm danger", onclick: () => openStartAfreshDialog()}, "Start afresh…"))], "danger")),
    foot: [el("div", {style: "flex:1"}), el("button", {class: "btn ghost", onclick: closeModal}, "Close")],
  });
}
