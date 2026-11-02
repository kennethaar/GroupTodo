function openVaultDialog() {
  tourMarkSeen("vault");
  const lastSync = getSetting("last_sync");
  const linkedKnown = !!LINKED;
  const onFolder = V.backend && V.backend.kind === "fs";
  const area = Spaces.active || "this area";
  const hint = (text, top) => el("div", {style: "color:var(--fg3);font-size:12px;margin-top:" + (top || 6) + "px"}, text);

  /* A checkbox row, drawn the way the space switcher draws its toggles. */
  const toggle = (on, title, sub, flip) => {
    const box = el("button", {type: "button", role: "checkbox", "aria-checked": on ? "true" : "false",
      class: "spacetoggle" + (on ? " on" : ""), onclick: () => {
        on = !on;
        box.classList.toggle("on", on);
        box.textContent = on ? "✓" : "";
        box.setAttribute("aria-checked", on ? "true" : "false");
        flip(on);
      }}, on ? "✓" : "");
    return el("div", {style: "display:flex;gap:10px;align-items:flex-start"},
      box, el("div", {}, el("div", {}, title), sub ? hint(sub, 2) : null));
  };

  /* One line says where the work is; the full list of what this browser can
     and cannot do is folded away, because only the missing pieces ever matter. */
  const status = el("div", {class: "field"},
    capLine(V.backend?.kind === "fs" || V.backend?.kind === "http",
      V.backend?.kind === "fs" ? "Files in “" + V.backend.label + "”"
      : V.backend?.kind === "http" ? "Synced with " + V.backend.label
      : "Only in this browser"),
    CAP.persist === "memory" ? capLine(false, CAP.sandboxed
      ? "Locked preview frame (SharePoint or Teams) - nothing is stored. Save the vault file."
      : "This browser stores nothing for this page. Save the vault file before closing.") : null,
    el("details", {style: "margin-top:4px"},
      el("summary", {}, "What this browser can do"),
      capLine(CAP.persist !== "memory", CAP.persist === "ls" ? "Keeps changes (localStorage)" : "Keeps changes between visits"),
      capLine(CAP.dirPicker, CAP.dirPicker ? "Opens folders" : "Cannot open folders (normal in Firefox, Safari and Chrome before 132)"),
      capLine(CAP.savePicker, CAP.savePicker ? "Links a vault file for one-click sync" : "Cannot link a vault file"),
      capLine(SW_READY, SW_READY ? "Works offline and installs"
        : CAP.fromFile ? "Opened as a file: no offline, install or Share" : "No offline copy yet"),
      capLine(canShareFiles(), canShareFiles() ? "Share button for the vault file" : "Vault file downloads instead of sharing")));

  /* Name, photo and whether either is written down sit together: they are
     all one question, "does this area know it was me". */
  const nameInput = el("input", {placeholder: "Full name", value: whoAmI(), "aria-label": "Your name in " + area,
                                 style: "flex:1;min-width:0"});
  const face = el("span", {style: "display:contents"});
  const photoBtns = el("span", {style: "display:flex;gap:6px"});
  const avatarRow = el("div", {style: "display:flex;gap:12px;align-items:center"}, face, nameInput, photoBtns);
  // Redraws around the name box, never the box itself, so typing keeps its focus.
  const drawAvatar = () => {
    const who = whoAmI();
    face.textContent = photoBtns.textContent = "";
    if (!who) return;
    face.append(avatarNode(who, 36));
    // A plain append() writes a null out as the word "null".
    photoBtns.append(...[
      el("button", {class: "btn sm ghost", onclick: () => pickAvatar(who, drawAvatar)},
        avatarOf(who) ? "Change photo" : "Add photo"),
      avatarOf(who) ? el("button", {class: "btn sm ghost", title: "Remove photo", "aria-label": "Remove photo",
        onclick: () => { clearAvatar(who); drawAvatar(); }}, "✕") : null].filter(Boolean));
  };
  nameInput.addEventListener("change", () => {
    setIdentity(nameInput.value, Spaces.active);
    notify(trim(nameInput.value)
      ? "Changes in " + area + " will be signed " + trim(nameInput.value) + "."
      : "Name cleared - changes will not be signed.");
    drawAvatar();
    render();
  });
  drawAvatar();

  const stampsBox = el("div");
  const drawStamps = () => {
    stampsBox.textContent = "";
    const n = attributionOff() ? countStamps() : 0;
    if (n) stampsBox.append(el("button", {class: "btn sm ghost", style: "margin-top:8px", onclick: () => {
      if (!confirm("Remove " + n + " existing stamp(s) from " + area + "? This rewrites those files and cannot be undone."))
        return;
      clearExistingStamps(); drawStamps();
    }}, "Remove the " + n + " stamps already here"));
  };
  drawStamps();

  /* The two moments to move the file between phone and PC. */
  const workBox = el("div", {class: "field"},
    el("label", {}, "Your working hours"),
    (() => {
      const wh = workHours();
      const from = clockInput(wh ? wh.start : "");
      const to = clockInput(wh ? wh.end : "");
      const save = () => {
        if (!!from.value !== !!to.value) return;     // half a workday is not one yet
        if ([from, to].some(i => i.classList.contains("bad"))) return;
        setWorkHours(from.value, to.value);
        notify(from.value ? "Working " + from.value + " to " + to.value + ", Monday to Friday." : "Working hours cleared.");
      };
      from.addEventListener("change", save);
      to.addEventListener("change", save);
      return el("div", {},
        el("div", {style: "display:flex;gap:8px;align-items:center"}, from, el("span", {}, "to"), to),
        el("div", {style: "color:var(--fg3);font-size:12px;margin-top:6px"},
          "Kept on your own page as work_hours::, so your phone knows them too. Half an hour " +
          "either side of starting, the PC asks for what you did on your phone; half an hour " +
          "either side of finishing, the phone asks for the PC's file. Once a day, and not at " +
          "all on a day you have already brought one in. Monday to Friday unless the page says " +
          "otherwise, e.g. work_hours:: 08:00-16:00 mon-sat."));
    })());

  /* Late is not a reason to cancel anything; a birthday that has passed is. */
  const expireBox = el("div", {class: "field"},
    el("label", {}, "Birthday tasks"),
    toggle(birthdayTasksExpire(), "Cancel a birthday task once the birthday has passed",
      "A task that says birthday and links a person with birthday:: on their page, like Buy a " +
      "present for Anna's birthday [[p/Anna Berg]]. Every area, this device. Any other task goes " +
      "only on its own until:: date - until:fri in the box at the top, or the field in its panel.",
      on => {
        PREF.set("expire.birthdays", on ? "1" : "0");
        notify(on ? "Birthday tasks go once the birthday has passed."
                  : "Birthday tasks stay until you deal with them.");
        if (on) expireOverdue();
      }));

  const clockBox = el("div", {class: "field"},
    el("label", {}, "Time on tasks"),
    toggle(clockOnDoing(), "Start a clock when a task goes to Doing",
      "It stops when the task leaves Doing, and the time shows as ⏱ under the line. " +
      "Every area, this device. Off, Doing is only a state; time already clocked stays.",
      on => {
        PREF.set("clock.doing", on ? "1" : "0");
        notify(on ? "Doing starts a clock." : "Doing starts no clock.");
      }));

  /* Chores on track need no decision in the review; one missed this many rounds does (#215). */
  const choreBox = el("div", {class: "field choresreview"},
    el("label", {}, "Chores in the weekly review"),
    (() => {
      const n = el("input", {type: "number", min: "0", max: "99", value: String(actChoreRounds()), style: "width:4.5em",
        "aria-label": "Rounds missed", onchange: () => {
          const v = Math.max(0, Math.min(99, Math.floor(+n.value) || 0));
          n.value = String(v);
          PREF.set("review.chores", String(v));
          notify(v ? "The review shows chores missed for " + v + (v === 1 ? " round." : " rounds.") : "The review leaves chores out.");
        }});
      return el("div", {},
        el("div", {style: "display:flex;gap:8px;align-items:center"}, el("span", {}, "Show chores missed for"), n, el("span", {}, "rounds")),
        el("div", {style: "color:var(--fg3);font-size:12px;margin-top:6px"},
          "A chore on track comes round by itself, so Actions leaves it out. 0 leaves every chore out. This device."));
    })());

  const qrBox = el("div", {class: "field"},
    el("label", {}, "Phone numbers and places"),
    toggle(qrFirst(), "Show a QR code to scan instead of calling from this PC",
      "For tel:, telto:, sms:, geo: and mapto: links. The phone's camera reads the code and offers " +
      "to call, or opens the place in Maps, so it works when the phone and PC are not paired. " +
      "Shift-click a link for the other one, or a person, organisation or place for the numbers " +
      "and addresses on its page. This device.",
      on => {
        PREF.set("links.qr", on ? "1" : "");
        notify(on ? "Phone numbers and places show a QR code." : "Phone numbers and places open on this PC.");
        render();
      }));

  const askBox = el("div", {class: "field"},
    el("label", {}, "Context check"),
    toggle(contextPromptsOn(), "Ask at 12:00 and 17:00 whether I am still where my context says",
      "A toast with a Change button. This device.",
      on => {
        PREF.set("context.prompts", on ? "1" : "");
        notify(on ? "Asking at 12:00 and 17:00." : "Not asking about your context.");
      }));

  const senseBox = el("div", {class: "field"},
    el("label", {}, "Sense where I am"),
    toggle(senseOn(), "Offer a context when GroupToDo opens",
      "From this device, wifi or not, and places you saved. This device.",
      on => {
        PREF.set("sense.on", on ? "1" : "");
        notify(on ? "Offering a context when GroupToDo opens." : "Not sensing where you are.");
      }),
    el("button", {class: "btn ghost", style: "margin-top:8px", onclick: () => { closeModal(); openSenseSetup(); }},
      "Set up places…"));

  const youBox = el("div", {class: "field"},
    el("label", {}, "You in " + area),
    avatarRow,
    el("div", {style: "margin-top:10px"},
      toggle(!attributionOff(), "Sign what I add and finish",
        "Writes by:: and done_by:: into the files, for everyone sharing " + area + ".",
        on => {
          setSetting("no_attribution", on ? "" : "true");
          notify(on ? "Changes in " + area + " will be signed." : "Nothing in " + area + " records who did what.");
          drawStamps(); render();
        })),
    stampsBox);

  /* Purpose and colour: what the area is, as opposed to where it is kept. */
  const colourPreview = colorPreview(Spaces.active || "Area", spaceColor(Spaces.active));
  const areaBox = el("div", {class: "field"},
    el("label", {}, "Area"),
    segPicker(Object.values(HORIZON_PROFILES), horizonProfile().key, k => {
      setSetting("horizon_profile", k);
      render();
    }),
    hint("Changing it hides or shows altitudes. Nothing is deleted."),
    el("div", {style: "margin-top:12px"},
      colorPicker(spaceColor(Spaces.active), async c => {
        colourPreview.paint(c);
        if (await Spaces.setColor(Spaces.active, c)) renderNav();
      }),
      colourPreview.node),
    el("button", {class: "btn ghost", style: "margin-top:12px", onclick: () => { closeModal(); openSpaceStorageSetup(); }},
      "Manage areas"),
    hint("Every area's folder, name, colour and order, and adding or removing one."));

  /* The folder first: it is the answer to "where are my files". The vault
     file below is a courier between devices, not a second home. */
  const folderBox = CAP.dirPicker ? el("div", {class: "field"},
    el("label", {}, "Folder"),
    el("div", {style: "display:flex;gap:10px;align-items:center;flex-wrap:wrap"},
      el("button", {class: onFolder ? "btn ghost" : "btn primary", onclick: connectFolder},
        onFolder ? "Change folder" : "Choose folder"),
      el("span", {style: "color:var(--fg2);font-size:13px"},
        onFolder ? "“" + (V.backend.label || "") + "”" : "None - kept in this browser")),
    hint("Plain .md files Obsidian, Logseq and Neovim open. Share the folder to share " + area + ".")) : null;

  const devicesBox = el("div", {class: "field"},
    el("label", {}, onFolder ? "Phone" : "Other devices"),
    el("div", {style: "display:flex;gap:8px;flex-wrap:wrap"},
      CAP.savePicker
        ? el("button", {class: "btn primary", onclick: () => linkedKnown ? syncLinked() : linkVaultFile()},
            linkedKnown ? "Sync now" : "Link vault file")
        : null,
      el("button", {class: "btn" + (CAP.savePicker ? " ghost" : " primary"), onclick: () => saveBundleAsDownload()},
        canShareFiles() ? "Send vault file" : "Save vault file"),
      el("button", {class: "btn ghost", onclick: () => openBundleFromFile()}, "Open vault file"),
      CAP.savePicker && linkedKnown
        ? el("button", {class: "btn ghost", onclick: () => linkVaultFile()}, "Re-link")
        : null),
    hint(onFolder
      ? "One .md file carries " + area + " to a phone and back. Keep it outside the folder. Edits merge per page."
      : "One .md file in iCloud, OneDrive or Dropbox, synced on each device. Edits merge per page."),
    CAP.savePicker && linkedKnown ? el("div", {style: "margin-top:10px"},
      toggle(autoSyncOn(), "Sync by itself", "On open, on return, and a minute after typing stops.", on => {
        PREF.set("autosync", on ? "1" : "0");
        notify(on ? "Syncing the linked file on its own." : "Sync only when you press it.");
      })) : null,
    hint(lastSync ? "Last sync " + formatStamp(lastSync) : "Not synced yet."));

  const serverInput = el("input", {
    placeholder: "http://127.0.0.1:8777", "aria-label": "Sync server address",
    value: safeLS.get("gtd.server") || (CAP.served ? location.origin : "http://127.0.0.1:8777"),
  });

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

  const timezone = (() => {
    const sel = el("select", {"aria-label": "Timezone"});
    let zones = [];
    try { zones = Intl.supportedValuesOf("timeZone") || []; } catch (_) {}
    if (!zones.length) {
      zones = ["UTC", "Europe/Oslo", "Europe/London", "Europe/Berlin", "America/New_York",
               "America/Los_Angeles", "Asia/Singapore", "Asia/Tokyo", "Australia/Sydney"];
    }
    let detected = "UTC";
    try { detected = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"; } catch (_) {}
    if (!zones.includes(detected)) zones.unshift(detected);
    sel.append(el("option", {value: ""}, "This device (" + detected + ")"));
    for (const z of zones) sel.append(el("option", {value: z}, z));
    sel.value = PREF.get("timezone", "") || "";
    sel.addEventListener("change", () => {
      PREF.set("timezone", sel.value);
      notify("Times shown in " + (sel.value || detected) + ". Files stay in UTC.");
      render();
    });
    return sel;
  })();

  /* The words on screen: this device's choice, from the files in 8/Languages. */
  const langBox = el("div", {class: "field"},
    el("label", {}, "Language"),
    el("div", {style: "display:flex;gap:8px;align-items:center;flex-wrap:wrap"},
      el("span", {translate: "no"}, PREF.get("lang", "") || LANG_BASE),
      el("button", {class: "btn ghost", onclick: () => openLanguageDialog()}, "Change or add a language")),
    hint("On this device. Get a language from GitHub, or translate it yourself."));

  /* Everything used once a year, folded. Start afresh stays last: you pass
     every way of keeping your work before the way of losing it. */
  const more = el("details", {},
    el("summary", {style: "padding:8px 16px"}, "More"),
    el("div", {class: "field"},
      el("label", {}, "Timezone"), timezone,
      hint("Changes what you see, including which day is today. Files stay in UTC.")),
    el("div", {class: "field"},
      el("label", {}, "Sync server"),
      el("div", {style: "display:flex;gap:8px"},
        serverInput,
        el("button", {class: "btn ghost", onclick: () => connectServer(trim(serverInput.value))}, "Connect"),
        el("button", {class: "btn ghost", onclick: () => { safeLS.del("gtd.server"); notify("Server forgotten."); }}, "Forget")),
      hint("serve.py on Termux, a Raspberry Pi or any always-on box.")),
    el("div", {class: "field"},
      el("label", {}, "Import"),
      el("div", {style: "display:flex;gap:8px;flex-wrap:wrap"},
        el("button", {class: "btn ghost", onclick: () => fileInput.click()}, "Import .md / .org files"),
        V.raw.size ? el("button", {class: "btn ghost", onclick: () => { importOrgFiles(); closeModal(); }},
          "Convert " + V.raw.size + " .org files") : null),
      fileInput),
    onFolder ? el("div", {class: "field"},
      el("label", {}, "Check the folder"),
      el("button", {class: "btn ghost", onclick: () => { closeModal(); openFolderCheck(); }}, "Check the folder"),
      hint("Pages in the folder that do not show here.")) : null,
    el("div", {class: "field"},
      el("label", {}, "Start afresh"),
      el("button", {class: "btn danger", onclick: () => openStartAfreshDialog()}, "Start afresh…"),
      hint("Empties this browser and reloads. " + (onFolder
        ? "Files in “" + (V.backend.label || "the folder") + "” are kept; reconnect the folder after."
        : "Save the vault file first - this cannot be undone."))));

  modal({
    center: true, title: "Vault & sync - " + (Spaces.active || "space"),
    body: el("div", {}, status, folderBox, devicesBox, youBox, workBox, expireBox, clockBox, choreBox, qrBox, askBox, senseBox, areaBox, langBox,
      plannerField(hint, toggle), usageField(hint, toggle), more),
    foot: [
      el("button", {class: "btn ghost", onclick: () => { closeModal(); openShareSpaceInvite(); }}, "Invite somebody"),
      el("div", {style: "flex:1"}),
      el("button", {class: "btn ghost", onclick: closeModal}, "Close"),
    ],
  });
}
