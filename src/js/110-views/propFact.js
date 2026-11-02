function propFact(path, k, v) {
  if (k.toLowerCase() === BIRTHDAY_PROP && pageKind(path) === "person") return birthdayFact(path, k, v);
  // The timer's settings: the pill lists the values, Take it off last.
  const timerSetting = path === TIMER_PATH && TIMER_SETTINGS[k.toLowerCase()];
  if (timerSetting) return {
    key: k, raw: k + ":: " + v,
    save: text => saveRawProp(path, k, text),
    pills: () => [factPill(trim(v || "") ? timerSetting.word(trim(v)) : "+ pick " + k, trim(v || "") ? "fquiet" : "fwant",
      timerSetting.name + ": " + timerSetting.about, () => timerSettingMenu(k.toLowerCase()))],
  };
  // A tracker at the top of a page gets the same boxes it gets as a line.
  const trk = parseTracker(k + ":: " + v);
  if (trk) return {
    key: trackerTitle(trk.name), raw: k + ":: " + v, own: true,
    save: text => saveRawProp(path, k, text),
    pills: () => [trackerWidget(trk, text => saveRawProp(path, k, text), {date: dayOfPath(path)})],
  };
  const directive = templateChoiceDirective(v);
  const placeholder = /^%[A-Za-z0-9_-]+%$/.test(trim(v || ""));
  if (directive) {
    const folder = directive.folder;
    const relation = directive.direction === "^" ? "parent" : directive.direction === "_" ? "child" : null;
    return {
      key: k, raw: k + ":: " + v,
      save: text => saveRawProp(path, k, text),
      pills: () => [factPill("+ choose " + k, "fwant",
        "Choose " + (relation ? relation + " from " : "from ") + folder + "/", () => {
        const items = templateChoiceItems(folder);
        if (!items.length) { notify("No pages found in " + folder + "/.", "warn"); return; }
        listPicker({title: "Choose " + k, items, typeahead: true, label: x => x.label, detail: x => x.detail,
          onPick: x => {
            const selectedPath = findExistingPage(x.value.replace(/^\[\[/, "").replace(/\]\]$/, ""));
            if (!applyTemplateRelation(path, selectedPath, directive.direction)) return;
            saveRawProp(path, k, k + ":: " + x.value);
            render();
          },
          footer: el("button", {class: "btn ghost", onclick: () => writePropValue(path, k)}, "+ another value")});
      })],
    };
  }
  if (placeholder || !trim(v || "")) {
    return {
      key: k, raw: k + ":: " + v,
      save: text => saveRawProp(path, k, text),
      pills: () => [factPill("+ write " + k, "fwant", "Write " + k, () => writePropValue(path, k))],
    };
  }
  const link = factLinkTarget(v);
  // A time reads as a time and a day as a day, however the file wrote it.
  const when = /^(updated|created|reviewed|last_seen|deadline|started|completed)$/i.test(k);
  const shown = when ? (/\dT\d/.test(v) ? formatStamp(v) : dateIn(v) ? humanDate(dateIn(v)) : v)
                     : (linkWords(v) || v);
  const menu = () => chipMenu(k, "a value on this page", lettered([
    link ? ["Go to " + linkWords("[[" + link + "]]"), link, () => followLink(link)] : null,
    ["Change it", null, () => writePropValue(path, k, v)],
    ["Take it off", "the rest of the page stays", () => { saveRawProp(path, k, ""); render(); }],
  ]));
  /* An address opens in its own app on a plain click, the way a [[link]]
     follows on one; Ctrl/Cmd-click still brings up change or take off. */
  const app = !when && !link && factAppLink(k, v);
  if (app) return {
    key: k, raw: k + ":: " + v,
    save: text => saveRawProp(path, k, text),
    pills: () => {
      const qr = phoneUriOf(app) ? ", Shift-click " + (qrFirst() ? "to open on this PC" : "for a QR code") : "";
      const pill = factPill(shown, "fquiet b applink-fact", app + "  (Ctrl-click to change" + qr + ")", null);
      pill.addEventListener("mousedown", e => e.preventDefault());
      pill.addEventListener("click", e => {
        e.stopPropagation();
        if (e.ctrlKey || e.metaKey) menu(); else openAppLink(app, e.shiftKey);
      });
      return [pill];
    },
  };
  return {
    key: k, raw: k + ":: " + v,
    save: text => saveRawProp(path, k, text),
    pills: () => [factPill(shown, "fquiet", k + ":: " + v, menu)],
  };
}
