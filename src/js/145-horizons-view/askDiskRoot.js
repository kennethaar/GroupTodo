function askDiskRoot(space, then) {
  const sp = Spaces.get(space);
  const name = (V.backend && V.backend.label) || (sp && sp.label) || space;
  promptInput({
    title: "Where is " + name + " on this computer?",
    label: "The folder's full path, as Explorer's address bar shows it",
    value: PREF.get(diskRootKey(space)) || "",
    placeholder: "C:\\Users\\you\\OneDrive\\" + name,
    hint: "Asked once for this area on this device. The browser knows the folder by name only.",
    cta: "Save",
    onSave: v => {
      const p = tidyDiskPath(v);
      if (!p) return;
      PREF.set(diskRootKey(space), p);
      notify("Kept: " + space + " is " + p + " here.");
      if (then) then(p);
    },
  });
}
