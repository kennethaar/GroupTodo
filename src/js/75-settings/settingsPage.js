function settingsPage() {
  if (!V.pages.has(SETTINGS_PATH)) {
    putPage(SETTINGS_PATH, {
      props: {title: "GTD", type: "settings", created: todayStamp(), started: todayISO()},
      blocks: [newBlock({title: "System settings for GroupToDo. Safe to edit by hand."})],
    });
  }
  return getPage(SETTINGS_PATH);
}
